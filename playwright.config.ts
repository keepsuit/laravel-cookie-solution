import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'e2e',
    forbidOnly: !!process.env.CI,
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
