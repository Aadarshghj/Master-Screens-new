import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./index";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible input component with consistent styling, focus states, and validation support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "datetime-local",
        "time",
        "file",
        "hidden",
        "color",
        "range",
        "checkbox",
        "radio",
      ],
      description: "HTML input type",
    },
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the input is disabled",
    },
    required: {
      control: { type: "boolean" },
      description: "Whether the input is required",
    },
    readOnly: {
      control: { type: "boolean" },
      description: "Whether the input is read-only",
    },
  },
  args: {
    placeholder: "Enter text...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic input types
export const Default: Story = {
  args: {
    placeholder: "Default input",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter your email",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter your password",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter a number",
    min: 0,
    max: 100,
  },
};

export const File: Story = {
  args: {
    type: "file",
    accept: "image/*,.pdf,.doc,.docx",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
    defaultValue: "This input is disabled",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "This input is read-only",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Pre-filled value",
    placeholder: "This has a value",
  },
};
