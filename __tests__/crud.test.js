describe('Note Management Tests', () => {
    // Before all tests run, navigate to the testing page
    beforeAll(async () => {
        // Direct the browser to the specific URL for our tests
        await page.goto('https://camman00.github.io/CSE110-SP24-Lab6-Template/');
    });

    // Test case to verify that adding a note increases the count of notes on the page
    it('Note Creation Verification Test', async () => {
        // Locate and click the "Add Note" button to initiate note creation
        const addNoteButton = await page.$('.add-note');
        await addNoteButton.click();
        // Count all elements with class '.note' to determine total number of notes
        const noteTotal = await page.$$eval('.note', notes => notes.length);
        // Verify that the total number of notes has increased by one
        expect(noteTotal).toEqual(1);
        // Fetch the value of the new note to ensure it's empty as expected
        const noteContent = await page.$eval('.note', note => note.value);
        expect(noteContent).toEqual('');
        // Ensure the placeholder text is correctly set for the new note
        const notePlaceholder = await page.$eval('.note', note => note.placeholder);
        expect(notePlaceholder).toEqual('New Note');
    }, 3500); // Timeout for this test is set to 3500 milliseconds

    // Test case to verify that editing a note properly updates its content
    it('Note Content Update Test', async () => {
        // Select the first note for content update
        const noteInput = await page.$('.note');
        // Focus on the note and type the test message
        await noteInput.click();
        await page.type('.note', 'Test Note');
        // Simulate pressing 'Tab' to potentially trigger any blur event related to note saving
        await page.keyboard.press('Tab');
        // Retrieve the updated content of the note to verify the change
        const updatedNoteContent = await page.$eval('.note', note => note.value);
        expect(updatedNoteContent).toEqual('Test Note');
        // Ensure no additional notes were inadvertently created during this process
        const noteCount = await page.$$eval('.note', notes => notes.length);
        expect(noteCount).toEqual(1);
    });

    // Test case to ensure that notes retain their content even after a page refresh
    it('Note Persistence Post-Refresh Test', async () => {
        console.log("Refreshing to check persistence");
        // Reload the page to simulate a user refreshing the browser
        await page.reload();
        // Check the content of the first note to confirm it remains unchanged
        const retainedNoteContent = await page.$eval('.note', note => note.value);
        expect(retainedNoteContent).toEqual('Test Note');
        // Confirm the number of notes is still correct after the page reload
        const notesQuantity = await page.$$eval('.note', notes => notes.length);
        expect(notesQuantity).toEqual(1);
    });

    // Test case to validate that adding a second note is handled correctly
    it('Multiple Notes Handling Test', async () => {
        // Trigger the creation of a second note
        const addNoteButton = await page.$('.add-note');
        await addNoteButton.click();
        // Focus on the second note and input test content
        const secondNoteInput = await page.$('.note:nth-of-type(2)');
        await secondNoteInput.click();
        await page.type('.note:nth-of-type(2)', 'Test Note #2');
        // Confirm the new content by simulating a 'Tab' press
        await page.keyboard.press('Tab');
        // Validate the content of the second note
        const secondNoteContent = await page.$eval('.note:nth-of-type(2)', note => note.value);
        expect(secondNoteContent).toEqual('Test Note #2');
        // Verify the total number of notes on the page has incremented correctly
        const totalNotes = await page.$$eval('.note', notes => notes.length);
        expect(totalNotes).toEqual(2);
    }, 3500); // Timeout for this test is set to 3500 milliseconds

    // Test case to ensure that deleting a note works as intended
    it('Note Deletion Functionality Test', async () => {
        console.log("Testing note deletion");
        // Sequentially click to delete each note present on the page
        await page.click('.note', {clickCount: 2});
        await page.click('.note', {clickCount: 2});
        // Verify that all notes are indeed deleted
        const notesRemaining = await page.$$eval('.note', notes => notes.length);
        expect(notesRemaining).toBe(0);
    });

    // Test case to verify functionality with multiple notes added and then custom content modifications
    it('Complex Note Interaction Test', async () => {
        const addNoteButton = await page.$('.add-note');
        console.log("Adding multiple notes");
        // Add two notes to the page
        for (let i = 0; i < 2; i++) {
            await addNoteButton.click();
        }
        // Verify the content and modify each note individually
        const notes = await page.$$('.note');
        for (let i = 0; i < notes.length; i++) {
            await page.click(`.note:nth-of-type(${i + 1})`);
            await page.type(`.note:nth-of-type(${i + 1})`, `Custom Content ${i + 1}`);
            await page.keyboard.press('Tab');
        }
        // Verify that the custom content matches what was entered
        for (let i = 0; i < notes.length; i++) {
            const noteContent = await page.$eval(`.note:nth-of-type(${i + 1})`, note => note.value);
            expect(noteContent).toEqual(`Custom Content ${i + 1}`);
        }
        console.log("Deleting all notes");
        // Delete all notes to clean up after testing
        for (let i = 0; i < notes.length; i++) {
            await page.click('.note', {clickCount: 2});
        }
    }, 15700); // Extended timeout for this more complex test

});
