import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'e2e',
    forbidOnly: !!process.env.CI,
    // The banner layout is read by `e2e/banner.spec.ts` from the project metadata.
    projects: ['modal', 'card'].map((layout) => ({
        name: layout,
        use: { ...devices['Desktop Chrome'] },
        metadata: { layout },
    })),
});
