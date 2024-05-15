Cameron Black

## Question 1: Automated Testing

1. We use Github Actions to run automated tests on every code push or PR. This ensures new code works correctly and doesn't introduce break existing features. While developers are encouraged to test locally, automated tests are recquired in the pipeline to prevent unshippable code and hidden bugs. If tests fail, the developer and team are notified immediately, allowing quick issue resolution and promoting transparency. This process keeps the codebase bug-free and functional.

## Question 2: E2E Test...

No, it's not appropriate to use an End-to-End (E2E) test to verify a function's output. A unit test is more suitable for this purpose as it deals with small, isolated functions. E2E tests are meant for assessing the complete application and its overall workflow encompassing external inputs and user interactions. They offer a thorough examination of the entire application, whereas unit tests are aimed at testing individual functions.