import { submitJournal } from "@/app/action/submitJournal";

export default function NewJournalPage() {
  return (
    <form action={submitJournal}>
      <h1>Write Your Journal</h1>

      <label htmlFor="mood">Mood:</label>
      <select id="mood" name="mood" defaultValue="2">
        <option value="0">:( (Sad)</option>
        <option value="1">:| (Neutral)</option>
        <option value="2">:) (Happy)</option>
        <option value="3">:D (Excited)</option>
        <option value="4">:O (Surprised)</option>
        <option value="5">&gt;:&lt; (Angry)</option>
      </select>

      <label htmlFor="text">Journal Text:</label>
      <textarea id="text" name="text" placeholder="Write about your day..." />

      <label htmlFor="gratitude">Gratitude:</label>
      <input
        type="text"
        id="gratitude"
        name="gratitude"
        placeholder="What are you grateful for?"
      />

      <label htmlFor="tags">Tags (comma separated):</label>
      <input
        type="text"
        id="tags"
        name="tags"
        placeholder="e.g. happy, study"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
