# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.02s |
| sync | 10.0 | 29/29 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 81 cues for 81 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.0 | 18.8 weighted events per 10 s, longest silence 1.6 s; 13.9 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 3 runs of typing/ticks count once (14 sounds) |
| variety | 1.0 | 47 source recordings, 36 families in 67 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 22.8 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.6 dBTP |
| loudness | 8.0 | final -17.8 LUFS; target -14 LUFS not reached: the file measures -17.8 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 81 sounds lose more than 6 dB |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: 6 takes of the same recording family 'swell' (0.30s, 1.02s, 16.40s, 18.41s, 21.64s, 27.47s); mix in other sounds
2. variety: deep is the source of 4 sounds (2.15s, 3.22s, 23.42s, 25.66s); a slice or a pitch step does not make it another sound
3. variety: swell is the source of 3 sounds (0.30s, 16.40s, 27.47s); a slice or a pitch step does not make it another sound

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.02s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.93s  the busiest two seconds (13 sounds); also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is every sound still distinct, or does it turn to mud? / can it be heard at all?
  3.   17.75s  'success x0.45': brought 6 dB down to the perceived level of its role. Listen for: a sound brought down that far can get lost: does it still carry its moment?
  4.   21.36s  'pop x0.30': retuned -1.97 st to the note A4 of the score under it. Listen for: does it sit in the key of the music, or does it clash?
  5.   25.66s  'hit x0.75': the highest peak of the film (-6 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 2

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.02s |
| sync | 10.0 | 30/30 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 68 cues for 68 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.0 | 16.6 weighted events per 10 s, longest silence 1.3 s; 13.2 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 2 runs of typing/ticks count once (8 sounds) |
| variety | 5.6 | 49 source recordings, 40 families in 60 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 23.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.6 dBTP |
| loudness | 8.0 | final -17.3 LUFS; target -14 LUFS not reached: the file measures -17.3 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 68 sounds lose more than 6 dB |

**FIX**: lowest axis 5.6 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: 4 takes of the same recording family 'm' (3.76s, 24.27s, 25.70s, 26.92s); mix in other sounds
2. pacing: two whoosh sounds 60 ms apart at 0.30s smear
3. pacing: two whoosh sounds 110 ms apart at 2.78s smear

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.02s  'swish x0.45': the first sound of the film: the hook; also 'bell x0.50' at 0.80s: retuned -1.7 st to the note B6 of the score under it. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does it sit in the key of the music, or does it clash?
  2.    1.93s  the busiest two seconds (11 sounds); also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is every sound still distinct, or does it turn to mud? / can it be heard at all?
  3.   17.75s  'success x0.45': brought 6 dB down to the perceived level of its role. Listen for: a sound brought down that far can get lost: does it still carry its moment?
  4.   25.66s  'hit x0.75': the highest peak of the film (-6 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 3

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.02s |
| sync | 10.0 | 33/33 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 66 cues for 66 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 16.6 weighted events per 10 s, longest silence 1.8 s; 13.2 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 2 runs of typing/ticks count once (8 sounds) |
| variety | 7.6 | 49 source recordings, 43 families in 58 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 23.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.6 dBTP |
| loudness | 8.0 | final -17.5 LUFS; target -14 LUFS not reached: the file measures -17.5 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.3 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 66 sounds lose more than 6 dB |

**FIX**: lowest axis 7.6 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: 4 takes of the same recording family 'swell' (3.22s, 14.10s, 21.64s, 27.47s); mix in other sounds

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.02s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.93s  the busiest two seconds (10 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  3.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role; also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: a thin recording lifted that far can turn harsh: is it clean? / can it be heard at all?
  4.   26.92s  'celesta x0.30': retuned -2.02 st to the note G5 of the score under it; also 'hit x0.75' at 25.66s: the highest peak of the film (-6 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 4

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 27/27 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 66 cues for 66 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 9.0 | 15.3 weighted events per 10 s, longest silence 1.6 s; 11.9 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 2 runs of typing/ticks count once (7 sounds) |
| variety | 8.7 | 52 source recordings, 46 families in 59 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.5 dBTP |
| loudness | 8.0 | final -17.9 LUFS; target -14 LUFS not reached: the file measures -17.9 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 66 sounds lose more than 6 dB |

**PASS**: lowest axis 8.0 (every axis must reach 8; ok to show)

Nothing blocks showing it. If there is time, the cheapest polish:
1. pacing: two whoosh sounds 107 ms apart at 7.45s smear

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.05s  'wipe x0.60': brought 6 dB down to the perceived level of its role; also '' at 1.75s: the busiest two seconds (10 sounds). Listen for: a sound brought down that far can get lost: does it still carry its moment? / is every sound still distinct, or does it turn to mud?
  3.   25.30s  'passagem3d x0.70': the highest peak of the film (-6 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  4.   26.92s  'celesta x0.30': retuned -2.02 st to the note G5 of the score under it. Listen for: does it sit in the key of the music, or does it clash?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 4 in this order, 3 s each

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 5

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 26/26 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 65 cues for 65 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 15.3 weighted events per 10 s, longest silence 1.6 s; 11.9 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 2 runs of typing/ticks count once (7 sounds) |
| variety | 9.0 | 52 source recordings, 46 families in 58 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.6 dBTP |
| loudness | 8.0 | final -17.8 LUFS; target -14 LUFS not reached: the file measures -17.8 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 65 sounds lose more than 6 dB |

**PASS**: lowest axis 8.0 (every axis must reach 8; ok to show)

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.75s  the busiest two seconds (10 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  3.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role; also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: a thin recording lifted that far can turn harsh: is it clean? / can it be heard at all?
  4.   26.92s  'celesta x0.30': retuned -2.02 st to the note G5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-6 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 4 in this order, 3 s each

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 6

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 26/26 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 65 cues for 65 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 15.3 weighted events per 10 s, longest silence 1.6 s; 11.9 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 2 runs of typing/ticks count once (7 sounds) |
| variety | 9.0 | 52 source recordings, 46 families in 58 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.0 dBTP |
| loudness | 6.0 | final -18.2 LUFS; target -14 LUFS not reached: the file measures -18.2 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 65 sounds lose more than 6 dB |

**FIX**: lowest axis 6.0 (every axis must reach 8; ok to show)

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.75s  the busiest two seconds (10 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  3.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role; also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: a thin recording lifted that far can turn harsh: is it clean? / can it be heard at all?
  4.   26.92s  'celesta x0.30': retuned -2.02 st to the note G5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-6 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 4 in this order, 3 s each

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 7

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 26/26 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 65 cues for 65 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 15.3 weighted events per 10 s, longest silence 1.6 s; 11.9 gestures per 10 s (the references run up to 15.11; this film has no sound of its own, so too busy is judged by that number); 2 runs of typing/ticks count once (7 sounds) |
| variety | 9.0 | 52 source recordings, 46 families in 58 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.0 dBTP |
| loudness | 6.0 | final -18.2 LUFS; target -15 LUFS not reached: the file measures -18.2 LUFS (sparse sound; going further would need heavy limiting) |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 65 sounds lose more than 6 dB |

**FIX**: lowest axis 6.0 (every axis must reach 8; ok to show)

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.75s  the busiest two seconds (10 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  3.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role; also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: a thin recording lifted that far can turn harsh: is it clean? / can it be heard at all?
  4.   26.92s  'celesta x0.30': retuned -2.02 st to the note G5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-6 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 4 in this order, 3 s each

(The sound of this film is only SFX: --style clean-sfx-refs sets it against nine finished SFX reels, numbers only, no scores.)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 8

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 26/26 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 65 cues for 65 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.5 | 15.3 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (7 sounds) |
| variety | 9.0 | 52 source recordings, 46 families in 58 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.8 dBTP |
| loudness | 5.0 | final -21.1 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak +2 dB vs the original around it, big sounds +3 dB (whole-track gap +4 LU) (44 event(s) on speech left to the speech axis) |
| audibility | 9.8 | 1 of 65 sounds sit more than 30 dB under the film's own sound in the mix (median -8 dB, after the ducking) |
| speech | 7.0 | 2 sound(s) in 2 moment(s) are within 3 dB of the voice or above it (2 above) even after ducking |
| low_end | 1.0 | 8 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 65 sounds lose more than 6 dB; the film loses 0.1 LU in mono against 0.0 LU for the original (+0.1 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'thump x0.29' at 2.15s piles onto the bass already there (-32 dB); lower it 12 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit x0.40' at 3.22s piles onto the bass already there (-26 dB); lower it 11 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. speech: 1 sound(s) around 23.87s ('glitch x0.25' +3.8 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.75s  the busiest two seconds (10 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  3.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role; also 'glitch x0.22' at 3.24s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: a thin recording lifted that far can turn harsh: is it clean? / can it be heard at all?
  4.   23.87s  'glitch x0.25': 1 sound(s) on top of the voice, +3.8 dB against it. Listen for: is every word still understood?
  5.   26.92s  'celesta x0.30': retuned -2.02 st to the note G5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-6 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 9

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 9.6 | 20/21 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 56 cues for 56 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 13.7 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (6 sounds) |
| variety | 9.6 | 47 source recordings, 41 families in 50 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.0 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.6 dBTP |
| loudness | 5.0 | final -21.3 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -5 dB vs the original around it, big sounds -3 dB (whole-track gap +10 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.5 | 2 of 56 sounds sit more than 30 dB under the film's own sound in the mix (median -12 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 1.0 | 7 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.7 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 56 sounds lose more than 6 dB; the film loses 0.1 LU in mono against 0.0 LU for the original (+0.1 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'thump x0.29' at 2.15s piles onto the bass already there (-32 dB); lower it 2 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit x0.40' at 3.22s piles onto the bass already there (-26 dB); lower it 5 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. sync: 'thump x0.40' at 23.42s peaks -73 ms from the moment

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   17.90s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   23.42s  'thump x0.40': its peak sits -73 ms from the moment; also 'glitch x0.10' at 23.87s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it feel early or late against the picture? / can it be heard at all?
  5.   26.42s  'pop x0.50': retuned +1.95 st to the note D#5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-10 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 10

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 9.6 | 20/21 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 56 cues for 56 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 13.7 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (6 sounds) |
| variety | 9.6 | 47 source recordings, 41 families in 50 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.6 dBTP |
| loudness | 5.0 | final -21.4 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -6 dB vs the original around it, big sounds -6 dB (whole-track gap +11 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.5 | 2 of 56 sounds sit more than 30 dB under the film's own sound in the mix (median -12 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 4.0 | 4 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.6 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 56 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 4.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit x0.40' at 3.22s piles onto the bass already there (-26 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit x0.30' at 17.52s piles onto the bass already there (-28 dB); lower it 6 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. sync: 'thump x0.40' at 23.42s peaks -73 ms from the moment

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   17.90s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   23.42s  'thump x0.40': its peak sits -73 ms from the moment; also 'glitch x0.10' at 23.87s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it feel early or late against the picture? / can it be heard at all?
  5.   26.42s  'pop x0.50': retuned +1.95 st to the note D#5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-10 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 11

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 9.6 | 21/22 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 56 cues for 56 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 13.7 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (6 sounds) |
| variety | 9.6 | 47 source recordings, 41 families in 50 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.7 dBTP |
| loudness | 5.0 | final -21.4 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -6 dB vs the original around it, big sounds -6 dB (whole-track gap +12 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.5 | 2 of 56 sounds sit more than 30 dB under the film's own sound in the mix (median -13 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.5 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 56 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. sync: 'thump x0.40' at 23.49s peaks -118 ms from the moment
2. low end: 'hit x0.40' at 3.22s piles onto the bass already there (-26 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. low end: 'hit x0.30' at 17.52s piles onto the bass already there (-28 dB); lower it 6 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   17.90s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   23.49s  'thump x0.40': its peak sits -118 ms from the moment; also 'glitch x0.10' at 23.87s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it feel early or late against the picture? / can it be heard at all?
  5.   26.42s  'pop x0.50': retuned +1.95 st to the note D#5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-10 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 12

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 22/22 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 56 cues for 56 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 13.7 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (6 sounds) |
| variety | 9.6 | 47 source recordings, 41 families in 50 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.6 dBTP |
| loudness | 5.0 | final -21.4 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -10 dB vs the original around it, big sounds -7 dB (whole-track gap +12 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 56 sounds sit more than 30 dB under the film's own sound in the mix (median -14 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 8.5 | 1 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.7 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 56 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'brandhit x0.75' at 25.66s piles onto the bass already there (-30 dB); lower it 1 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. hierarchy: 'passagem3d x0.42' at 25.30s is 9 dB quieter (perceived level) than the other whoosh sounds: a thin recording, pick a fuller one (search.py --role whoosh --sheet) or raise it

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   17.90s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   23.87s  'glitch x0.10': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  5.   26.42s  'pop x0.50': retuned +1.95 st to the note D#5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-10 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 13

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 22/22 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 56 cues for 56 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 13.7 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (6 sounds) |
| variety | 9.6 | 47 source recordings, 41 families in 50 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.6 dBTP |
| loudness | 5.0 | final -21.4 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -10 dB vs the original around it, big sounds -7 dB (whole-track gap +12 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 56 sounds sit more than 30 dB under the film's own sound in the mix (median -14 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.7 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 56 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. hierarchy: 'passagem3d x0.62' at 25.30s is 9 dB quieter (perceived level) than the other whoosh sounds: a thin recording, pick a fuller one (search.py --role whoosh --sheet) or raise it

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   17.90s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   23.87s  'glitch x0.10': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  5.   26.42s  'pop x0.50': retuned +1.95 st to the note D#5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-11 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 14

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.20s |
| sync | 10.0 | 22/22 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 56 cues for 56 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 13.7 weighted events per 10 s, longest silence 1.6 s; 2 runs of typing/ticks count once (6 sounds) |
| variety | 9.6 | 47 source recordings, 41 families in 50 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.7 dBTP |
| loudness | 5.0 | final -21.4 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -10 dB vs the original around it, big sounds -7 dB (whole-track gap +12 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 56 sounds sit more than 30 dB under the film's own sound in the mix (median -14 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.8 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 56 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. hierarchy: 'passagem3d x0.62' at 25.30s is 9 dB quieter (perceived level) than the other whoosh sounds: a thin recording, pick a fuller one (search.py --role whoosh --sheet) or raise it

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.20s  'swish x0.45': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.76s  'glass x0.45': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   17.90s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   23.87s  'glitch x0.10': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  5.   26.42s  'pop x0.50': retuned +1.95 st to the note D#5 of the score under it; also 'brandhit x0.75' at 25.66s: the highest peak of the film (-11 dBFS before the master). Listen for: does it sit in the key of the music, or does it clash? / is it big without hurting on headphones, and does the music under it pump?
  -> /workspace/stickverse/projetos/kavora/sfx/result/ouvir.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).