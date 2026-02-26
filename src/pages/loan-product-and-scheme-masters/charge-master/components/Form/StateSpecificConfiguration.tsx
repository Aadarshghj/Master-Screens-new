import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { StateZoneSelector } from "./StateZoneSelector";
import { StateCheckboxGrid } from "./StateCheckboxGrid";
import { Flex, HeaderWrapper, Label, TitleHeader } from "@/components";
import type { ChargeMasterFormData } from "@/types/loan-product-and-scheme-masters/charge-master.types";
import {
  useGetZonesQuery,
  useGetStateZoneConfigQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/charge-master";
import { logger } from "@/global/service";

export const StateSpecificConfiguration: React.FC = () => {
  const { control, watch, setValue } = useFormContext<ChargeMasterFormData>();

  const specificToState = watch("stateConfiguration.specificToState");
  const selectedStates = watch("stateConfiguration.selectedStates") || [];

  const [selectedStateIdentities, setSelectedStateIdentities] = useState<
    Set<string>
  >(new Set(selectedStates));

  const {
    data: zones = [],
    isLoading: isLoadingZones,
    error: zonesError,
  } = useGetZonesQuery(undefined, {
    skip: false, // Always fetch zones
  });

  const {
    data: stateZoneConfig = [],
    isLoading: isLoadingStates,
    error: statesError,
  } = useGetStateZoneConfigQuery(undefined, {
    skip: false, // Always fetch states
  });

  // Group states by zone
  const groupedStatesByZone = useMemo(() => {
    const grouped: { [zoneIdentity: string]: typeof stateZoneConfig } = {};

    stateZoneConfig.forEach(state => {
      if (!grouped[state.zoneIdentity]) {
        grouped[state.zoneIdentity] = [];
      }
      grouped[state.zoneIdentity].push(state);
    });

    return grouped;
  }, [stateZoneConfig]);

  const allStates = useMemo(() => stateZoneConfig, [stateZoneConfig]);

  // Get all state identities for when toggle is false
  const allStateIdentities = useMemo(() => {
    return new Set(allStates.map(state => state.identity));
  }, [allStates]);

  useEffect(() => {
    if (zonesError) {
      logger.error("Failed to load zones", { toast: true });
    }
    if (statesError) {
      logger.error("Failed to load state configurations", { toast: true });
    }
  }, [zonesError, statesError]);

  // When toggle changes or states load
  useEffect(() => {
    if (!specificToState && allStates.length > 0) {
      // When toggle is false, show all states as selected
      setSelectedStateIdentities(allStateIdentities);
    } else {
      // When toggle is true, use the form's selected states
      setSelectedStateIdentities(new Set(selectedStates));
    }
  }, [specificToState, selectedStates, allStateIdentities, allStates.length]);

  const handleZoneToggle = (zoneIdentity: string, checked: boolean) => {
    // Only allow interaction when toggle is true
    if (!specificToState) return;

    const statesInZone = groupedStatesByZone[zoneIdentity] || [];
    const newSelected = new Set(selectedStateIdentities);

    if (checked) {
      statesInZone.forEach(state => newSelected.add(state.identity));
    } else {
      statesInZone.forEach(state => newSelected.delete(state.identity));
    }

    setSelectedStateIdentities(newSelected);
    setValue("stateConfiguration.selectedStates", Array.from(newSelected));
  };

  const handleStateToggle = (identity: string, checked: boolean) => {
    // Only allow interaction when toggle is true
    if (!specificToState) return;

    const newSelected = new Set(selectedStateIdentities);

    if (checked) {
      newSelected.add(identity);
    } else {
      newSelected.delete(identity);
    }

    setSelectedStateIdentities(newSelected);
    setValue("stateConfiguration.selectedStates", Array.from(newSelected));
  };

  const isZoneFullySelected = (zoneIdentity: string) => {
    const statesInZone = groupedStatesByZone[zoneIdentity] || [];
    return statesInZone.every(state =>
      selectedStateIdentities.has(state.identity)
    );
  };

  return (
    <div className="rounded-sm border border-cyan-600 bg-white p-6">
      <Flex justify="between" align="center" className="mb-6 w-full">
        <HeaderWrapper>
          <TitleHeader title="State-Specific Configuration" />
        </HeaderWrapper>
      </Flex>

      <div className="mb-6">
        <Flex align="center" className="mt-6">
          <Controller
            name="stateConfiguration.specificToState"
            control={control}
            render={({ field }) => (
              <Switch
                id="specificToState"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="specificToState" className="text-xs font-medium">
            Specific to State
          </Label>
        </Flex>
        <p className="mt-1 text-xs text-gray-500">
          {specificToState
            ? "Enable 'specific to state' for state-wise configuration"
            : "All states are selected by default. Enable 'specific to state' to customize selection"}
        </p>
      </div>

      {isLoadingZones || isLoadingStates ? (
        <div className="py-8 text-center text-sm text-gray-500">
          Loading zones and states...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Zone selectors */}
          <div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {zones
                .filter(zone => zone.isActive)
                .map(zone => (
                  <StateZoneSelector
                    key={zone.identity}
                    zoneName={zone.zoneName}
                    isSelected={isZoneFullySelected(zone.identity)}
                    onToggle={checked =>
                      handleZoneToggle(zone.identity, checked)
                    }
                    disabled={!specificToState}
                  />
                ))}
            </div>

            {/* line Separator  */}
            <div className="my-6 border-t border-gray-200" />
          </div>

          {/* State checkboxes */}
          <div>
            {allStates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <StateCheckboxGrid
                  states={allStates}
                  selectedStates={selectedStateIdentities}
                  onStateToggle={handleStateToggle}
                  disabled={!specificToState}
                />
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No states available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
