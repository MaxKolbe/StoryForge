export const STORY_PROMPT = (topic: string, characters: string[]): string => `
You are a creative fiction writer.

Your task is to generate a complete short story from the structured inputs provided below.

Rules:
- Carefully read the values inside each XML-style tag.
- The story MUST revolve around the provided topic.
- The provided character(s) must play a central role in the story.
- Create a coherent beginning, middle, and ending.
- Maintain internal consistency for names, events, and details.
- Show actions, dialogue, and character decisions instead of only describing them.
- Keep the story engaging and easy to read.
- Do not mention the input tags or explain your process.
- Do not include headings, notes, markdown, or metadata.
- Return only the story.
- Length: 500-800 words.

Input:
<topic>${topic}</topic>

<characters>
${characters.map((character) => `<character>${character}</character>`).join('\n')}
</characters>

Examples:

Example 1

Input:
<topic>A mysterious lighthouse that appears only during storms</topic>

<characters>
<character>Maya, a young cartographer</character>
<character>Captain Darius, a retired sailor</character>
</characters>

Output:
Maya had spent three years mapping every island along the coast, yet no chart she owned showed the lighthouse that flashed across the horizon during the storm.
At first she thought it was lightning. Then the beam came again, sweeping across the sea in a slow arc.
"You saw it too?" asked Captain Darius, gripping the dock railing.
Maya nodded.
"The lighthouse isn't supposed to exist."
Darius stared into the rain. "That's because it only appears when the sea wants something."
The next morning, when the storm refused to break, Maya convinced Darius to take her aboard his small vessel. Together they followed the distant light through waves that seemed determined to turn them back.
Hours later they arrived at a rocky island that neither of them had ever seen before.
The tower stood alone in the center.
Inside, they discovered old journals written by lighthouse keepers dating back centuries. Each entry described ships saved from disaster, but the final pages told a different story. The lighthouse was fading because people had stopped believing in legends.
As another violent wave struck the island, the lantern above them flickered.
"If the light goes out," Maya whispered, "what happens to the ships?"
Darius looked toward the sea. "They'll have nobody left to guide them."
Together they climbed the tower and reignited the great lantern using oil stored beneath the stairs. The beam burst across the dark ocean.
Far away, a merchant vessel changed course and avoided hidden reefs.
The storm finally began to weaken.
When sunrise arrived, the island started fading into mist.
Maya quickly sketched every detail she could before it vanished.
Back on the mainland, she added the lighthouse to her charts. Most people doubted her story, but sailors who crossed the coast afterward always reported seeing a guiding light during the worst storms.
And whenever thunder rolled across the sea, Maya smiled, knowing the lighthouse had not disappeared after all.


Now generate a new story using the provided inputs.`