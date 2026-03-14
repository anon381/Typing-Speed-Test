export interface Passage { id: string; text: string; }

export const passages: Passage[] = [
  { id: 'full-long', text: 'Practicing typing over longer passages builds endurance and precision. This extended practice passage is designed to fill a full typing test: keep your posture steady, your breathing regular, and move your fingers with calm intention across the keys. Read ahead where helpful, but avoid rushing; accuracy now yields speed later. Notice punctuation and capitalization, and treat mistakes as brief signals to correct and continue. Over time, these two-minute-like stretches will train the nervous system to favor the correct sequences and reduce reliance on backspaces, so let your hands find a steady cadence and maintain a comfortable rhythm until the passage completes.' },
  // 15s passages (short)
  { id: 't15-1', text: 'Pack my box with five dozen liquor jugs.' },
  { id: 't15-2', text: 'Sphinx of black quartz, judge my vow.' },
  { id: 't15-3', text: 'Bright vixens jump; dozy fowl quack.' },
  { id: 't15-4', text: 'Quick zephyrs blow, vexing daft Jim.' },
  { id: 't15-5', text: 'Two driven jocks help fax my big quiz.' },
  { id: 't15-6', text: 'Fix problem quickly with zeal and care.' },
  { id: 't15-7', text: 'Jump! Back, my quick fox.' },
  { id: 't15-8', text: 'Bold chefs mix syrup and jam.' },
  { id: 't15-9', text: 'Wavy zephyrs lift small kites.' },
  { id: 't15-10', text: 'Glib jocks quiz nymph to vex dwarf.' },
  { id: 't15-11', text: 'Fast winds shake bright paper flags.' },
  { id: 't15-12', text: 'Quick minds solve tricky code paths.' },
  { id: 't15-13', text: 'Small sparks light dark winter nights.' },
  { id: 't15-14', text: 'Brave kids jump over muddy logs.' },
  { id: 't15-15', text: 'Fresh bread warms cold morning hands.' },
  { id: 't15-16', text: 'Green hills glow after soft rain.' },
  { id: 't15-17', text: 'Swift birds skim above quiet lakes.' },
  { id: 't15-18', text: 'Sharp eyes catch tiny moving dots.' },
  { id: 't15-19', text: 'Calm waves roll onto sandy shores.' },
  { id: 't15-20', text: 'Bright stars guide ships through fog.' },
  { id: 't15-21', text: 'Kind words lift heavy hearts quickly.' },
  { id: 't15-22', text: 'Light steps cross old wooden bridges.' },
  { id: 't15-23', text: 'Warm soup soothes after windy walks.' },
  { id: 't15-24', text: 'Cloud shadows sweep across open fields.' },
  { id: 't15-25', text: 'Tiny clocks tick through silent rooms.' },

  // 30s passages (short paragraph)
  { id: 't30-1', text: 'Sunlight pours through high windows as the keys click in a steady rhythm; keep the pace gentle and the fingers relaxed.' },
  { id: 't30-2', text: 'A small river of words moves under the cursor; read steadily and let your hands follow the story without haste.' },
  { id: 't30-3', text: 'The cat slept on the warm keyboard while distant traffic hummed; each sentence is a small step toward fluency.' },
  { id: 't30-4', text: 'Short focused bursts sharpen your reflexes: begin deliberately, then let speed emerge from accuracy.' },
  { id: 't30-5', text: 'Practice sentences of medium length to build rhythm and confidence before longer stretches.' },
  { id: 't30-6', text: 'Breathe, relax your shoulders, and allow your hands to remember where the letters live.' },
  { id: 't30-7', text: 'Simple, steady practice beats frantic sessions; aim for calm repetition and small wins.' },
  { id: 't30-8', text: 'The morning light makes the page glow and the words flow more easily than imagined.' },
  { id: 't30-9', text: 'Take short rests between trials and return with fresh focus to type more cleanly.' },
  { id: 't30-10', text: 'A gentle cadence matters: find the tempo that suits you and keep it consistent.' },
  { id: 't30-11', text: 'Practice with clear short paragraphs that contain punctuation, then repeat them until the hands feel smooth and calm.' },
  { id: 't30-12', text: 'When you keep your shoulders relaxed and your breathing steady, your fingers usually make fewer rushed mistakes.' },
  { id: 't30-13', text: 'A short timed round is ideal for building confidence because it rewards focus and accurate key choices.' },
  { id: 't30-14', text: 'Read one small phrase ahead, then let the hands follow naturally instead of forcing speed too early.' },
  { id: 't30-15', text: 'Frequent thirty-second efforts are perfect for daily practice, especially when paired with quick breaks.' },
  { id: 't30-16', text: 'The goal is smooth rhythm first; once rhythm feels easy, your WPM usually climbs on its own.' },
  { id: 't30-17', text: 'Steady typing with minimal corrections beats wild sprinting, even during short and playful challenges.' },
  { id: 't30-18', text: 'Use this brief paragraph to lock in posture, finger reach, and confidence on common letter patterns.' },
  { id: 't30-19', text: 'Consistent short sessions help your brain map key locations until movement feels automatic and light.' },
  { id: 't30-20', text: 'Try to keep your eyes calm and your mind quiet; frantic reading usually harms timing and accuracy.' },
  { id: 't30-21', text: 'Quick rounds can still teach patience, because clean output matters more than chaotic speed spikes.' },
  { id: 't30-22', text: 'Use simple punctuation and varied word lengths so each trial trains a broader range of finger motion.' },
  { id: 't30-23', text: 'A short paragraph with balanced vocabulary gives enough challenge without creating unnecessary stress.' },
  { id: 't30-24', text: 'Keep your wrists neutral and your touch light, and the keyboard will feel easier across every sentence.' },
  { id: 't30-25', text: 'Small improvements in accuracy during this duration create strong momentum for longer timed tests.' },

  // 60s passages (longer paragraph)
  { id: 't60-1', text: 'Typing is less about hitting the keys quickly and more about training your muscle memory. Over the span of a minute, aim to keep errors minimal and focus on steady breathing while your hands maintain a comfortable rhythm.' },
  { id: 't60-2', text: 'Read each sentence clearly before you type; the mind often outruns the fingers. Over sixty seconds, you can practice linking short phrases into longer runs while preserving accuracy and minimizing backspace interruptions.' },
  { id: 't60-3', text: 'A long paragraph helps condition your eyes and hands to move smoothly across the line. Keep posture upright, relax the wrists, and pretend the letters flow from your fingertips like a practiced melody.' },
  { id: 't60-4', text: 'During a minute of practice, small pauses are fine—use them to recalibrate and proceed. Focused intervals build endurance and reduce the urge to rush single words at the expense of the overall rhythm.' },
  { id: 't60-5', text: 'Think of typing as phrasing: group words into meaningful chunks and move fluidly between them. This approach will increase both speed and comprehension as you practice longer passages.' },
  { id: 't60-6', text: 'Minute-long drills are ideal for shifting from deliberate practice to automatic execution. Let accuracy guide you; as errors drop, speed will naturally follow without force.' },
  { id: 't60-7', text: 'Sustained, mindful practice of medium-length sentences strengthens neural pathways. Keep an even tempo and treat mistakes as feedback rather than failure.' },
  { id: 't60-8', text: 'Use passages that vary punctuation and capitalization to strengthen different finger paths and reinforce consistent hand positions across diverse letter sequences.' },
  { id: 't60-9', text: 'As you type longer stretches, notice where your attention wanders and bring it back gently; each return builds focus and typing resilience.' },
  { id: 't60-10', text: 'Endurance in typing comes from regular, measured practice: minute-long efforts repeated daily create durable skill improvements.' },
  { id: 't60-11', text: 'A full minute gives enough time to settle into flow, correct early hesitation, and keep a thoughtful pace that favors clean output over impulsive speed.' },
  { id: 't60-12', text: 'Use this duration to connect phrases smoothly, keeping punctuation accurate while your hands maintain relaxed movement from one word group to the next.' },
  { id: 't60-13', text: 'When minute-long drills feel difficult, lower your pace slightly and prioritize precision; this approach produces better speed gains in later sessions.' },
  { id: 't60-14', text: 'Consistent one-minute practice teaches you to recover from small mistakes quickly without breaking rhythm or confidence in the remainder of the run.' },
  { id: 't60-15', text: 'Let your attention move gently ahead of the cursor so your fingers are prepared for punctuation, spacing, and occasional longer vocabulary.' },
  { id: 't60-16', text: 'A strong minute combines soft keystrokes, stable breathing, and controlled transitions between short clauses and longer descriptive sentences.' },
  { id: 't60-17', text: 'Treat this practice as rehearsal for real work: clear writing, steady output, and minimal corrections matter more than reckless bursts.' },
  { id: 't60-18', text: 'Varying sentence structure in this window helps your fingers adapt to different patterns while maintaining a comfortable and repeatable rhythm.' },
  { id: 't60-19', text: 'Use minute drills to build trust in your muscle memory, especially when punctuation appears in the middle of a fast phrase transition.' },
  { id: 't60-20', text: 'The goal for sixty seconds is not perfection but consistency; smooth repeats produce stronger long-term results than occasional lucky sprints.' },
  { id: 't60-21', text: 'If your hands tense, reset quickly with one deep breath and continue; endurance grows best when relaxation stays part of your typing technique.' },
  { id: 't60-22', text: 'One minute is long enough to test stamina and short enough to repeat often, making it ideal for daily structured progress.' },
  { id: 't60-23', text: 'Careful attention to spacing and punctuation in this duration strengthens accuracy habits that transfer well to longer writing sessions.' },
  { id: 't60-24', text: 'A measured pace through varied words helps your fingers stay agile and reduces common errors caused by rushing repeated letters.' },
  { id: 't60-25', text: 'Build confidence by finishing the minute cleanly; the final seconds should be as stable and precise as the opening line.' },

  // 120s passages (long-form)
  { id: 't120-1', text: 'Long-form typing practice trains both stamina and clarity: compose sentences that contain varied punctuation and length, and aim to maintain consistent rhythm for the full two minutes. Use breathing and posture as anchors to prevent fatigue and keep the hands nimble.' },
  { id: 't120-2', text: 'A two-minute passage gives you space to work through ideas and maintain finger flow across sentences. Read ahead just enough to prepare your hands, then allow muscle memory to guide character-by-character execution while smoothing transitions between clauses.' },
  { id: 't120-3', text: 'Sustained practice across longer passages increases both speed and accuracy; think in small phrases, keep shoulders relaxed, and use the full range of the keyboard. Over two minutes, your nervous system reinforces reliable patterns that make typing feel effortless.' },
  { id: 't120-4', text: 'When practicing for extended durations, include diverse vocabulary and punctuation to ensure your fingers remain adaptable. Train yourself to recover gracefully from mistakes and keep progressing through the passage without tensing up.' },
  { id: 't120-5', text: 'Two-minute drills are excellent for building confidence: pick interesting material, focus on smooth phrasing, and resist the urge to speed through errors; accuracy-first pacing will reward you with sustainable gains.' },
  { id: 't120-6', text: 'Use longer excerpts that read like short essays: they provide a natural flow of clauses and transitions which help you practice rhythm and maintain consistent WPM over time.' },
  { id: 't120-7', text: 'Training with longer passages allows you to simulate real-world typing tasks such as emails, reports, and notes—practice maintaining clarity while keeping a steady tempo and comfortable hand posture.' },
  { id: 't120-8', text: 'Two minutes of careful typing each day compounds quickly; these exercises strengthen finger memory and teach you to manage breath, posture, and focus across sustained work.' },
  { id: 't120-9', text: 'Gradually increase the complexity of the passages you type for extended periods; introducing varied sentence structures and punctuation builds versatility and reduces the risk of developing one-note habits.' },
  { id: 't120-10', text: 'Long practice sessions should end with light stretches and reflection: note which letter combinations felt awkward and add targeted drills to address them in the next session.' }
  ,
  { id: 't120-11', text: 'Two-minute typing sessions are long enough to reveal habits that short drills can hide. Use this passage to practice consistent punctuation, smooth phrase transitions, and calm breathing while preserving an even pace from start to finish without forcing bursts of speed.' },
  { id: 't120-12', text: 'During longer rounds, your best strategy is simple: read clearly, type steadily, and recover quickly from errors without panic. Maintaining this balance over two minutes will improve both your confidence and your practical writing speed in everyday tasks.' },
  { id: 't120-13', text: 'A sustained passage encourages full-body discipline: relaxed shoulders, neutral wrists, and gentle keystrokes. Keep your eyes slightly ahead of the cursor so punctuation and spacing feel predictable rather than disruptive as each sentence unfolds.' },
  { id: 't120-14', text: 'Extended practice rewards consistency over aggression. If you feel tempted to rush, return to a stable rhythm and let accurate key choices guide the run; speed gained from control tends to last longer than speed gained from chance.' },
  { id: 't120-15', text: 'In two-minute drills, attention management becomes as important as finger movement. Notice drifting focus early, reset with one deliberate breath, and continue typing with a light touch and measured cadence across every line.' },
  { id: 't120-16', text: 'Longer timed passages are ideal for building writing-ready endurance. They train your hands to stay reliable through mixed sentence lengths, varied punctuation, and occasional unfamiliar words that test adaptive keyboard reach.' },
  { id: 't120-17', text: 'Use this duration to reinforce quality: clean spacing, accurate capitalization, and minimal correction pauses. Over repeated sessions, this careful approach creates a stronger baseline for both typing speed and readability.' },
  { id: 't120-18', text: 'As the second minute begins, stay patient and protect your form. Many errors appear when posture slips or breathing tightens, so keep your movements soft and your pace controlled through the final sentence.' },
  { id: 't120-19', text: 'A productive two-minute effort should feel sustainable, not frantic. Aim for continuous flow, quick recovery after mistakes, and clear attention to punctuation marks that often interrupt momentum in less-practiced runs.' },
  { id: 't120-20', text: 'Treat this passage as a rehearsal for real communication: your goal is a balance of speed, clarity, and composure. Finishing steadily with few disruptions matters more than an unstable sprint at the beginning.' },
  { id: 't120-21', text: 'Sustained timed practice helps your nervous system trust repeating patterns. As confidence grows, your fingers begin to travel more efficiently, reducing hesitation around common transitions and improving total output naturally.' },
  { id: 't120-22', text: 'Two-minute rounds offer enough space to refine rhythm in a meaningful way. Keep punctuation precise, avoid heavy keystrokes, and let each phrase connect smoothly to the next without abrupt changes in tempo.' },
  { id: 't120-23', text: 'Use extended passages to test consistency under mild fatigue. The objective is steady quality in the final lines, where rushed habits often appear if attention and posture are not actively maintained.' },
  { id: 't120-24', text: 'When you practice this duration regularly, accuracy gains compound and speed follows. Focus on controlled movement through varied sentence structures and let repeated clean runs build durable fluency.' },
  { id: 't120-25', text: 'A strong two-minute performance is quiet and controlled: smooth finger travel, stable breathing, and minimal corrections. Keep reading ahead by short phrases and guide each line with patient precision.' }
  ,
  // Full-length passages (long-form) - bulk additions
  { id: 'full-1', text: 'Extended practice passages train both endurance and structure: sustain a clear mental map of punctuation while keeping a steady hand. Over this passage, focus on phrasing and maintain calm breathing as you move from clause to clause, allowing muscle memory to carry repetitive sequences.' },
  { id: 'full-2', text: 'A longer paragraph lets you practice transitions between ideas; type deliberately, then accelerate as errors decrease. Notice the small patterns of letters and pace your fingers to reduce correction pauses.' },
  { id: 'full-3', text: 'Sustained typing across a complete paragraph builds rhythm and confidence: choose a moderate tempo and preserve accuracy, letting speed emerge after consistent repetition and few interruptions.' },
  { id: 'full-4', text: 'Compose your attention around phrases rather than individual letters: grouping words reduces cognitive load and allows your hands to maintain smoother movement across the keyboard.' },
  { id: 'full-5', text: 'Use passages with diverse punctuation to solidify different transitions and capitalizations, so your fingers become comfortable with both letter sequences and the small shifts in hand movement.' },
  { id: 'full-6', text: 'Two-minute-like excerpts are useful for simulating real writing tasks: emails, notes, and short reports often require steady pacing and an eye for punctuation; practice those habits here.' },
  { id: 'full-7', text: 'As fatigue builds, keep your wrists relaxed and your shoulders loose; micro-adjust posture and continue typing with a light touch to prevent tension from reducing accuracy.' },
  { id: 'full-8', text: 'Longer training passages should include some redundancy and phrase repetition to strengthen key sequences; these repetitions help your brain encode efficient finger patterns.' },
  { id: 'full-9', text: 'Maintain awareness of the next words without obsessing over each character: a gentle preview of the next few letters helps your hands prepare and keeps the flow steady.' },
  { id: 'full-10', text: 'Gradually increasing passage complexity—more punctuation, varied vocabulary, longer clauses—makes sustained typing more resilient, improving both speed and clarity in the long run.' },
  { id: 'full-11', text: 'When practicing endurance passages, intentionally slow through difficult letter combinations: the deliberate repetition of those spots accelerates long-term improvement.' },
  { id: 'full-12', text: 'Pick content that holds your interest so the mind stays engaged; boredom causes micro-distractions that undermine consistent finger movement, whereas meaningful text encourages continuity.' },
  { id: 'full-13', text: 'Alternate between focused minute drills and longer two-minute passages to train both precision and stamina; different tempos develop complementary skills.' },
  { id: 'full-14', text: 'A realistic typing task involves varying sentence lengths; mimic that in practice and alternate between short bursts and longer, flowing sentences to keep hands versatile.' },
  { id: 'full-15', text: 'Keep a soft gaze two to three lines ahead while typing; looking forward reduces surprise when punctuation appears and helps the hands anticipate upcoming characters.' },
  { id: 'full-16', text: 'Practice passages should challenge slightly above comfortable speed to stimulate growth: push gently, correct minimally, and return with a calm intent to improve accuracy-first.' },
  { id: 'full-17', text: 'Use breath and rhythm as anchors: inhale on a brief pause, exhale through a phrase, and let the rhythm guide your hands rather than the opposite way around.' },
  { id: 'full-18', text: 'To build consistency, repeat similar passages across sessions; familiarity strengthens muscle memory, leaving more cognitive bandwidth for speed and precision.' },
  { id: 'full-19', text: 'Introduce modest challenge by adding uncommon words and punctuation blends: the goal is to broaden finger agility and reduce hesitation across various letter sequences.' },
  { id: 'full-20', text: 'Finish longer drills with a short review: note which letter groups felt slow and create micro-drills to address those specific transitions in the next session.' },
  { id: 'full-21', text: 'A well-crafted long passage moves through clauses and connectors, giving you opportunities to practice capitalization, commas, semicolons, and dashes while keeping a steady tempo.' },
  { id: 'full-22', text: 'When the text includes quotations or parentheses, practice the small hand adjustments to reach those keys without interrupting the rhythm—these are common in real typing tasks.' },
  { id: 'full-23', text: 'Two-minute rounds train your attention span: as you maintain focus, the hands naturally adopt smoother and faster motion; make each session consistent to compound benefits.' },
  { id: 'full-24', text: 'Long-form practice teaches pacing: avoid sprinting early and burning accuracy; distribute effort evenly so the end of the passage is as clean as the beginning.' },
  { id: 'full-25', text: 'A diverse vocabulary in long passages ensures your fingers learn a broad set of transitions; include verbs, prepositions, and compound nouns to cover common patterns.' },
  { id: 'full-26', text: 'Practice typing with a soft, relaxed pressure—light keystrokes travel faster and cause less fatigue, which helps when working through extended passages.' },
  { id: 'full-27', text: 'Structured two-minute exercises help with writing fluency too; the same pacing that aids typing also trains coherent sentence construction under time pressure.' },
  { id: 'full-28', text: 'Gradually increase difficulty by introducing punctuation clusters and less-common words; challenge produces adaptation and precision gains over time.' },
  { id: 'full-29', text: 'Endurance practice benefits from mindful recovery: after a long passage, stretch lightly and reflect on which sequences felt awkward to target next time.' },
  { id: 'full-30', text: 'Practice with realistic material—short articles, notes, or example emails—to make stamina training directly relevant to real-world tasks and keep motivation high.' }
];

export function randomPassage(category?: string, excludeId?: string): Passage {
  let filtered = passages;
  if (category) {
    if (category === 'full') filtered = passages.filter(p => p.id.startsWith('full'));
    else if (category === 't15') filtered = passages.filter(p => p.id.startsWith('t15-'));
    else if (category === 't30') filtered = passages.filter(p => p.id.startsWith('t30-'));
    else if (category === 't60') filtered = passages.filter(p => p.id.startsWith('t60-'));
    else if (category === 't120') filtered = passages.filter(p => p.id.startsWith('t120-'));
  }
  if (excludeId) filtered = filtered.filter(p => p.id !== excludeId);
  if (!filtered.length) filtered = passages;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
/**
 * passages.ts
 * -------------------
 * This module defines typing practice passages and provides a utility to get a random passage.
 *
 * 1. Passage Interface:
 *    - `id`: Unique identifier for the passage
 *    - `text`: The content of the passage
 *
 * 2. passages Array:
 *    - Contains a set of predefined passages for typing practice.
 *    - Each passage has a unique `id` and a motivating or instructional text.
 *
 * 3. randomPassage Function:
 *    - Returns a random passage from the `passages` array.
 *    - Optional `excludeId` parameter lets you skip a specific passage to avoid repetition.
 *    - Usage: `const passage = randomPassage();` or `const passage = randomPassage('classic-fox');`
 *
 * Example:
 * ```
 * const nextPassage = randomPassage('focus-flow');
 * console.log(nextPassage.text);
 * ```
 */
