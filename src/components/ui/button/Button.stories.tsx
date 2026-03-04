import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Download,
  Mail,
  Plus,
  Heart,
  Search,
  Settings,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import React from "react";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants and sizes, built with class-variance-authority for consistent styling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "Visual style variant of the button",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "Size of the button",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the button is disabled",
    },
    asChild: {
      control: { type: "boolean" },
      description: "Render as child element (using Radix Slot)",
    },
  },
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: "Default Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete Account",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    children: <Settings className="size-4" />,
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </>
    ),
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: (
      <>
        <Download className="size-4" />
        Download
      </>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        Send Email
        <Mail className="size-4" />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: "icon",
    children: <Plus className="size-4" />,
    "aria-label": "Add item",
  },
};

// Complex examples
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All button variants displayed together for comparison.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart className="size-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All button sizes displayed together for comparison.",
      },
    },
  },
};

export const ActionButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">
        <Save className="size-4" />
        Save
      </Button>
      <Button variant="outline">
        <Edit className="size-4" />
        Edit
      </Button>
      <Button variant="destructive">
        <Trash2 className="size-4" />
        Delete
      </Button>
      <Button variant="ghost" size="icon">
        <X className="size-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Common action buttons with icons.",
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button variant="outline" className="rounded-r-none border-r-0">
        <Edit className="size-4" />
        Edit
      </Button>
      <Button variant="outline" className="rounded-none border-r-0">
        <Download className="size-4" />
        Download
      </Button>
      <Button variant="outline" className="rounded-l-none">
        <Trash2 className="size-4" />
        Delete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons grouped together as a button group.",
      },
    },
  },
};

export const ResponsiveButtons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="w-full sm:w-auto">
          <Plus className="size-4" />
          Create New
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Responsive button layout that stacks on mobile and shows inline on desktop.",
      },
    },
  },
};

// Form examples
export const FormButtons: Story = {
  render: () => (
    <form className="max-w-md space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border px-3 py-2"
          placeholder="Enter your email"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Submit
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons used in a form context.",
      },
    },
  },
};

// Interactive examples
export const InteractiveStates: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLiked(!liked);
        setLoading(false);
      }, 1000);
    };

    return (
      <div className="space-y-4">
        <Button
          variant={liked ? "default" : "outline"}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
          )}
          {liked ? "Liked" : "Like"}
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive button with state changes and loading state.",
      },
    },
  },
};

// AsChild example
export const AsChildLink: Story = {
  render: () => (
    <Button asChild>
      <a href="#" target="_blank" rel="noopener noreferrer">
        External Link
      </a>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: "Button rendered as an anchor tag using the asChild prop.",
      },
    },
  },
};

// Accessibility example
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <Button aria-describedby="save-help">
        <Save className="size-4" />
        Save Document
      </Button>
      <p id="save-help" className="text-muted-foreground text-sm">
        Ctrl+S to save quickly
      </p>

      <Button variant="destructive" aria-describedby="delete-warning">
        <Trash2 className="size-4" />
        Delete Item
      </Button>
      <p id="delete-warning" className="text-destructive text-sm">
        This action cannot be undone
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with proper accessibility attributes and descriptions.",
      },
    },
  },
};
