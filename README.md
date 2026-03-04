# incede_nbfc_frontend_services

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin http://10.199.232.2:4500/incede_proj01/CBFSS/incede_nbfc_frontend_services.git
git branch -M develop
git push -uf origin develop
```

## Integrate with your tools

- [ ] [Set up project integrations](http://10.199.232.2:4500/incede_proj01/CBFSS/incede_nbfc_frontend_services/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

# If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

# Frontend Boilerplate

A modern React/TypeScript frontend boilerplate with Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, and React Router.

## Quick Start

### Opening in Workspace

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd inceed-frontend-boilerplate
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open in VS Code:**

   ```bash
   code .
   ```

   Or use the workspace file:

   ```bash
   code inceed.code-workspace
   ```

## Development Tools

### ESLint Configuration

This project uses ESLint for code quality and consistency. The configuration is in `eslint.config.js`.

**Available ESLint commands:**

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix

# Check specific files
npx eslint src/components/ --ext .ts,.tsx
```

**Key ESLint rules:**

- TypeScript-specific rules
- React hooks rules
- Import/export rules
- Code formatting consistency

### Code Formatting

The project uses Prettier for consistent code formatting:

```bash
# Format all files
npm run format
```

## Layouts

### Layout Structure

The project follows a modular layout system:

```
src/layout/
├── index.ts          # Layout exports
└── AuthLayout.tsx    # Authentication layout wrapper
```

### Using Layouts

**Authentication Layout:**

```tsx
import { AuthLayout } from "@/layout";

function LoginPage() {
  return (
    <AuthLayout>
      <div>Login content here</div>
    </AuthLayout>
  );
}
```

**Creating Custom Layouts:**

```tsx
// src/layout/CustomLayout.tsx
import { ReactNode } from "react";

interface CustomLayoutProps {
  children: ReactNode;
}

export function CustomLayout({ children }: CustomLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">{/* Header content */}</header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

## shadcn/ui Integration

This project uses shadcn/ui for beautiful, accessible UI components.

### Installation Commands

**Add new shadcn/ui components:**

```bash
# Add a button component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button input label badge

# Add with custom configuration
npx shadcn@latest add dialog --yes
```

**Initialize shadcn/ui (if needed):**

```bash
npx shadcn@latest init
```

### Using shadcn/ui Components

**Button Example:**

```tsx
import { Button } from "@/components/ui/button";

function MyComponent() {
  return (
    <div>
      <Button variant="default">Default Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

**Form Components:**

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
}
```

## Redux Best Practices

This project uses Redux Toolkit for state management with best practices.

### Store Structure

```
src/global/
├── store/
│   ├── index.ts           # Store configuration
│   └── root-reducer.ts    # Root reducer
├── reducers/
│   ├── index.ts           # Reducer exports
│   ├── auth.reducer.ts    # Authentication state
│   └── layout.reducer.ts  # Layout state
└── service/
    ├── index.ts           # API service exports
    ├── api-instance.ts    # API configuration
    └── base-query.ts      # RTK Query setup
```

### Creating Reducers

**Example: User Reducer**

```tsx
// src/global/reducers/user.reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: state => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

### Using Redux in Components

**Classic Redux Usage:**

```tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/global/store";
import { setUser, clearUser } from "@/global/reducers/user.reducer";

function UserProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  if (!currentUser) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {currentUser.name}!</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
```

**Custom Hooks for Redux:**

```tsx
// src/hooks/use-user.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/global/store";
import { setUser, clearUser } from "@/global/reducers/user.reducer";

export function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const login = (userData: User) => {
    dispatch(setUser(userData));
  };

  const logout = () => {
    dispatch(clearUser());
  };

  return {
    ...user,
    login,
    logout,
  };
}
```

### RTK Query for API Calls

**Creating API Slices:**

```tsx
// src/global/service/end-points/user.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  id: string;
  name: string;
  email: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: builder => ({
    getUser: builder.query<User, string>({
      query: id => `users/${id}`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: user => ({
        url: `users/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;
```

**Using RTK Query in Components:**

```tsx
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/global/service/end-points/user";

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useGetUserQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleUpdate = async (userData: Partial<User>) => {
    try {
      await updateUser(userData).unwrap();
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <Button
        onClick={() => handleUpdate({ name: "New Name" })}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Update Name"}
      </Button>
    </div>
  );
}
```

## Git Hooks with Husky

This project uses Husky to manage Git hooks for code quality and consistency.

### Installation

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky init

# Install lint-staged for staged files only
npm install --save-dev lint-staged
```

### Configuration

**Pre-commit hook:**

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Pre-push hook:**

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

## Storybook Integration

Storybook is used for component development and documentation in isolation.

### Configuration

**`.storybook/main.ts`:**

```typescript
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
```

**`.storybook/preview.ts`:**

```typescript
import type { Preview } from "@storybook/react";
import "../src/global.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: "light",
      list: [
        { name: "light", class: "light", color: "#ffffff" },
        { name: "dark", class: "dark", color: "#000000" },
      ],
    },
  },
};

export default preview;
```

### Creating Stories

**Button Component Story:**

```tsx
// src/components/ui/button/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
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
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};
```

### Storybook Addons

**Essential Addons:**

```bash
# Install additional addons
npm install --save-dev @storybook/addon-a11y @storybook/addon-viewport @storybook/addon-backgrounds
```

**Addon Configuration:**

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y", // Accessibility testing
    "@storybook/addon-viewport", // Responsive testing
    "@storybook/addon-backgrounds", // Background testing
    "@storybook/addon-themes", // Theme switching
  ],
  // ... rest of config
};
```

### Available Storybook Commands

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

### Storybook Best Practices

1. **Component Organization:**

   ```
   src/components/
   ├── ui/
   │   ├── button/
   │   │   ├── button.tsx
   │   │   └── button.stories.tsx
   │   └── input/
   │       ├── input.tsx
   │       └── input.stories.tsx
   ```

2. **Story Naming Convention:**
   - Use PascalCase for component names
   - Use descriptive story names
   - Group related components

3. **Documentation:**

   ```tsx
   // Add JSDoc comments for better documentation
   /**
    * Primary UI component for user interaction
    */
   export const Button = ({ ... }) => {
     // Component implementation
   };
   ```

## Project Structure

```
src/
├── api/                 # API layer
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── toast/          # Toast notifications
│   └── ErrorBoundary/  # Error handling
├── config/             # Configuration files
├── global/             # Global state and services
│   ├── reducers/       # Redux reducers
│   ├── service/        # API services
│   └── store/          # Redux store
├── hooks/              # Custom React hooks
├── layout/             # Layout components
├── pages/              # Page components
├── providers/          # Context providers
├── routes/             # Routing configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run prepare          # Husky hooks install
npm run storybook        # Storybook

# Type Checking
npm run type-check       # Run TypeScript compiler
```

## Configuration Files

- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`components.json`** - shadcn/ui configuration
- **`eslint.config.js`** - ESLint configuration
- **`.editorconfig`** - Editor configuration
- **`.husky/`** - Git hooks configuration
- **`.storybook/`** - Storybook configuration
