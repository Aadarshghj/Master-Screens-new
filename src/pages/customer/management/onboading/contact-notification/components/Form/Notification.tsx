import React, { useCallback, useState, useEffect } from "react";
import { Flex, Grid, Card, Switch, TitleHeader } from "@/components/ui";
import { Save, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import phone from "../../../../../../../assets/mobile.svg";
import email from "../../../../../../../assets/email.svg";
import watsup from "../../../../../../../assets/watsup.svg";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { logger } from "@/global/service";
import { toaster } from "@/components";
import {
  useGetNotificationPreferencesQuery,
  useCreateNotificationPreferencesMutation,
  useUpdateNotificationPreferencesMutation,
  useGetContactsQuery,
  useGetContactTypesDetailedQuery,
} from "@/global/service/end-points/customer/contact";
import type { NotificationPreferencesProps } from "@/types/customer/contact.types";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

// Local NotificationCard component
interface NotificationCardProps {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  tooltipMessage?: string;
  isAvailable?: boolean;
  customerId?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
  tooltipMessage,
  isAvailable = true,
}) => {
  const cardContent = (
    <Card
      className={`w-72 rounded-lg border border-blue-300 p-5  text-center shadow-lg ${
        !isAvailable ? "opacity-50" : ""
      } ${className}`}
    >
      <div>
        <img src={icon} alt={`${title} Icon`} className="mx-auto h-12 w-10" />
      </div>
      <TitleHeader
        title={title}
        className="text-foreground  text-lg font-bold"
      />
      <div className="">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled || !isAvailable}
        />
      </div>
      <p className=" text-sm">{description}</p>
    </Card>
  );

  if (tooltipMessage && !isAvailable) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent side="bottom" className="px-1 py-0.5">
            <p className="text-[10px]">{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};

export const NotificationPreference: React.FC<NotificationPreferencesProps> = ({
  customerId,
  readOnly = false,
}) => {
  const {
    data: notificationPrefsData,
    refetch: refetchPrefs,
    isLoading: isPrefsLoading,
    error: prefsError,
  } = useGetNotificationPreferencesQuery(customerId);

  const [createNotificationPrefs, { isLoading: isCreatingPrefs }] =
    useCreateNotificationPreferencesMutation();
  const [updateNotificationPrefs, { isLoading: isUpdatingPrefs }] =
    useUpdateNotificationPreferencesMutation();

  const isSavingPrefs = isCreatingPrefs || isUpdatingPrefs;

  // Fetch customer contacts and contact types
  const {
    data: contactsData = [],
    isLoading: isContactsLoading,
    error: contactsError,
  } = useGetContactsQuery(customerId || "", {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: contactTypesData = [],
    isLoading: isContactTypesLoading,
    error: contactTypesError,
  } = useGetContactTypesDetailedQuery();

  const [localPrefs, setLocalPrefs] = useState({
    sms: false,
    email: false,
    whatsapp: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Create a mapping of contact type UUIDs to names
  const contactTypeMap = React.useMemo(() => {
    const map = new Map<string, string>();
    contactTypesData?.forEach(type => {
      map.set(type.identity, type.contactType);
    });
    return map;
  }, [contactTypesData]);

  // Determine which notification options to show based on existing contact types
  const availableNotificationTypes = React.useMemo(() => {
    const types = {
      sms: false,
      email: false,
      whatsapp: false,
    };

    // Get unique contact types from customer's contacts
    const customerContactTypes = new Set(
      contactsData.map(contact => contact.contactType)
    );

    // Map contact type UUIDs to notification types
    customerContactTypes.forEach(contactTypeId => {
      const contactTypeName = contactTypeMap.get(contactTypeId)?.toLowerCase();

      if (contactTypeName === "mobile") {
        types.sms = true;
      } else if (contactTypeName === "email") {
        types.email = true;
      } else if (contactTypeName === "whatsapp") {
        types.whatsapp = true;
      }
    });

    return types;
  }, [contactsData, contactTypeMap]);

  // Sync local state with API data whenever it changes
  useEffect(() => {
    if (notificationPrefsData) {
      const newPrefs = {
        sms: notificationPrefsData.sms ?? false,
        email: notificationPrefsData.email ?? false,
        whatsapp: notificationPrefsData.whatsapp ?? false,
      };
      setLocalPrefs(newPrefs);
      setHasChanges(false);
    } else {
      // If no API data exists, enable toggles for available notification types
      setLocalPrefs(prev => ({
        sms: availableNotificationTypes.sms ? true : prev.sms,
        email: availableNotificationTypes.email ? true : prev.email,
        whatsapp: availableNotificationTypes.whatsapp ? true : prev.whatsapp,
      }));
      setHasChanges(true);
    }
  }, [notificationPrefsData, availableNotificationTypes]);

  const handleLocalPrefChange = useCallback(
    (pref: "sms" | "email" | "whatsapp", value: boolean) => {
      setLocalPrefs(prev => ({ ...prev, [pref]: value }));
      setHasChanges(true);
    },
    []
  );

  const handleSavePreferences = useCallback(async () => {
    try {
      // Send the switch states directly - they represent consent values
      const payload = {
        sms: localPrefs.sms,
        email: localPrefs.email,
        whatsapp: localPrefs.whatsapp,
        consentSms: localPrefs.sms, // Map switch state to consent
        consentEmail: localPrefs.email,
        consentWhatsapp: localPrefs.whatsapp,
      };

      // Determine whether to create or update based on existing preferences
      if (
        notificationPrefsData &&
        (notificationPrefsData.sms ||
          notificationPrefsData.email ||
          notificationPrefsData.whatsapp)
      ) {
        // Update existing preferences
        await updateNotificationPrefs({
          customerId,
          payload,
        }).unwrap();
      } else {
        // Create new preferences
        await createNotificationPrefs({
          customerId,
          payload,
        }).unwrap();
      }

      toaster.success("Notification preferences saved successfully");
      setHasChanges(false);

      // Refetch to get the updated preferences from the server
      await refetchPrefs();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to save notification preferences";
      toaster.error(errorMessage);
    }
  }, [
    localPrefs,
    createNotificationPrefs,
    updateNotificationPrefs,
    customerId,
    refetchPrefs,
    notificationPrefsData,
  ]);

  // Handle errors
  if (prefsError) {
    logger.error({
      error: prefsError,
      toast: true,
      message:
        "Unable to load notification preferences. Please try again later.",
    });
  }

  if (contactsError) {
    logger.error({
      error: contactsError,
      toast: false,
      message: "Unable to load contacts.",
    });
  }

  if (contactTypesError) {
    logger.error({
      error: contactTypesError,
      toast: false,
      message: "Unable to load contact types.",
    });
  }

  // Helper function - Switch should ONLY be disabled if opted out or in readOnly/loading state
  // Consent should NOT disable the switch, it should just show a warning message
  const isSwitchDisabled = () => {
    const isOptedOut =
      notificationPrefsData?.isOptOutPromotionalNotification === true;
    const result =
      readOnly ||
      isSavingPrefs ||
      isPrefsLoading ||
      isContactsLoading ||
      isContactTypesLoading ||
      isOptedOut;
    return result;
  };

  // Show loading state if any data is still loading
  if (isPrefsLoading || isContactsLoading || isContactTypesLoading) {
    return (
      <Grid className="mx-auto max-w-7xl px-2">
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader
              title="Notification Preferences"
              className="text-foreground"
            />
          </HeaderWrapper>
        </Flex>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading notification preferences...</span>
        </div>
      </Grid>
    );
  }

  // // Helper to get the appropriate message for each channel
  // const getChannelMessage = (
  //   channelConsent: boolean,
  //   channelName: string,
  //   channelEnabled: boolean
  // ) => {
  //   if (notificationPrefsData?.isOptedOutPromotional) {
  //     return "Opted out from promotional notifications - All notifications disabled";
  //   }
  //   if (!channelConsent) {
  //     return `${channelName} consent not provided - Contact support to enable consent`;
  //   }
  //   if (channelEnabled) {
  //     return `Receive important updates and alerts via ${channelName}`;
  //   }
  //   return `Enable to receive updates via ${channelName}`;
  // };

  return (
    <div className="mx-auto max-w-7xl px-2">
      {/* Header */}
      <div className="mb-8">
        <TitleHeader title="Notification Preferences" />
      </div>

      {/* Notification Cards */}
      <div className="mb-8 flex w-full flex-wrap justify-between gap-3">
        {/* SMS Notification Card */}
        <NotificationCard
          icon={phone}
          title="SMS Notification"
          description="Receive important updates and alerts via SMS"
          checked={localPrefs.sms}
          onCheckedChange={(value: boolean) => {
            handleLocalPrefChange("sms", value);
          }}
          disabled={isSwitchDisabled()}
          isAvailable={availableNotificationTypes.sms}
          tooltipMessage="Add a mobile contact to enable SMS notifications"
        />

        {/* Email Notification Card */}
        <NotificationCard
          icon={email}
          title="Email Notification"
          description="Get detailed information through email"
          checked={localPrefs.email}
          onCheckedChange={(value: boolean) =>
            handleLocalPrefChange("email", value)
          }
          disabled={isSwitchDisabled()}
          isAvailable={availableNotificationTypes.email}
          tooltipMessage="Add an email contact to enable email notifications"
        />

        {/* WhatsApp Notification Card */}
        <NotificationCard
          icon={watsup}
          title="WhatsApp Notification"
          description="Stay updated through WhatsApp messages"
          checked={localPrefs.whatsapp}
          onCheckedChange={(value: boolean) =>
            handleLocalPrefChange("whatsapp", value)
          }
          disabled={isSwitchDisabled()}
          isAvailable={availableNotificationTypes.whatsapp}
          tooltipMessage="Add a WhatsApp contact to enable WhatsApp notifications"
        />
      </div>

      {/* Show message if no notification options are available */}
      {!availableNotificationTypes.sms &&
        !availableNotificationTypes.email &&
        !availableNotificationTypes.whatsapp && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-muted-foreground mb-4">
              <img
                src={phone}
                alt="No contacts"
                className="mx-auto h-12 w-12"
              />
            </div>
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold">
              No Contact Types Available
            </h3>
            <p className="text-muted-foreground text-xs">
              Please add contacts (Mobile, Email, or WhatsApp) to configure
              notification preferences. Hover over the disabled cards above to
              see what's needed.
            </p>
          </div>
        )}

      {/* Save Button */}
      {(availableNotificationTypes.sms ||
        availableNotificationTypes.email ||
        availableNotificationTypes.whatsapp) && (
        <div className="flex justify-end">
          <NeumorphicButton
            type="button"
            variant="default"
            size="default"
            onClick={handleSavePreferences}
            disabled={isSavingPrefs || readOnly || !hasChanges}
          >
            {isSavingPrefs ? (
              <>
                <Loader2 width={12} />
                Saving...
              </>
            ) : (
              <>
                <Save width={12} />
                Save Notification
              </>
            )}
          </NeumorphicButton>
        </div>
      )}
    </div>
  );
};
