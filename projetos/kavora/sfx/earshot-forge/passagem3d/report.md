# forge thump: 'a soft deep doppler whoosh of an object flying toward the camera and landing softly, premium and subtle'

**Asked:** recipe `thump`, target 'a soft deep doppler whoosh of an object flying toward the camera and landing softly, premium and subtle', alternatives: 'a punchy kick drum', 'an explosion'; 0 reference recording(s); critic v2, mode designed.

**Budget:** strategy `es`, 120 critic-scored candidates (pop 16, 7 generations), pre-screen: 48 renders per generation ranked by measurement, the best 16 scored, reps 1, tone weight 1.0, seed 0.
Took 2.0 min for the search: 336 renders, 112 scored (54.7 scored / min, 164.2 rendered / min; render 68.5 s, measurements 24.01 s, critic 30.15 s).

## Search

| gen | best total | this gen best | this gen median | passes | best tone dB | sigma | note |
|---|---|---|---|---|---|---|---|
| 1 | 0.79 | 0.79 | -0.67 | 0/16 | - | 0.220 |  |
| 2 | 1.55 | 1.55 | -0.27 | 0/16 | - | 0.166 |  |
| 3 | 2.69 | 2.69 | 1.08 | 0/16 | - | 0.125 |  |
| 4 | 3.16 | 3.16 | 1.73 | 1/16 | - | 0.094 |  |
| 5 | 3.16 | 2.97 | 2.47 | 0/16 | - | 0.071 |  |
| 6 | 3.37 | 3.37 | 2.47 | 1/16 | - | 0.053 |  |
| 7 | 3.37 | 2.96 | 1.31 | 0/16 | - | 0.040 |  |

## Picks

Chosen by a fixed rule: 6 diverse strong candidates (parameters and sound differ), re-rendered on 3 new seeds each, the 3 with the best robust mean kept (passing at least half first).

### thump_01 (thump_01.wav)
- critic: PASS total 3.37: match z +3.37 (best alternative +1.60); p_real 0.38 (not required: designed); sounds like: a fast whoosh, cloth whipping through the air, a soft air whoosh; clean (no artifact or polish flag)
- robust (3 new seeds): mean 2.83, min 2.31, sd 0.41, pass rate 0.67
- AudioSet (held out, decided nothing): [('Whoosh, swoosh, swish', 0.379), ('Sound effect', 0.075), ('Explosion', 0.026)]
- params: `{"rise": 0.6, "rise_k": 0.48879, "hold": 0.15715, "fall": 0.3057, "fall_k": 0.9176, "start_db": -43.86986, "track": 0.90762, "f_peak": 432.05549, "up_oct": 1.88529, "down_oct": 3.5, "dop_st": 9.15186, "dop_w": 0.0097, "q_air": 2.05642, "lp_ratio": 1.84385, "flut_depth": 0.28396, "flut_f": 9.73748, "rustle": 0.50967, "rustle_f": 242.96584, "low_db": -22.73063, "low_f": 382.23862, "low_smooth": 0.00339, "sub_db": -13.69415, "sub_f": 45.7198, "sub_glide": 0.37944, "sub_drive": 0.73079, "hiss_db": -22.05521, "hiss_hp": 6830.15073, "hiss_open": 1.06127, "hiss_pow": 1.26057, "tone_db": -30.62898, "tone_q": 57.70011, "tone_ratio": 2.57515, "tone_pure": 0.8258, "grain_db": -50.0, "grain_rate": 155.17028, "grain_f": 4384.44055, "room_wet": 0.07204, "rt60": 2.0, "pan": 0.5, "width": 0.43251, "drive_db": 5.854, "end_db": -60.22115, "end_fade": 0.06288, "hiss_tail": 2.42366, "hiss_mfloor": 0.83075, "room_damp": 0.30038, "low_lag": 0.03773, "hiss_rustle": 0.0, "hiss_lo": 973.95332, "eq_lo_db": -4.28308, "eq_lo_f": 160.44144, "eq_hi_db": -4.37118, "eq_hi_f": 3637.61979, "hiss_pre": 1.10933, "hiss_width": 0.63123, "low_width": 0.61094, "tail_sweep": 0.1907, "tail_tau": 0.15487, "hiss_q": 2.29014, "tail_gust": 0.51011, "thump_db": -37.32751, "thump_f0": 156.80228, "thump_f1": 90.0, "thump_tau": 0.17736, "thump_lead": 0.01383}` seed 276190818

### thump_02 (thump_02.wav)
- critic: total 2.83: match z +2.83 (best alternative +1.50); p_real 0.46 (not required: designed); sounds like: a fast whoosh, a deep cinematic whoosh, a swoosh passing by; clean (no artifact or polish flag)
- robust (3 new seeds): mean 2.66, min 2.52, sd 0.11, pass rate 0.00
- AudioSet (held out, decided nothing): [('Whoosh, swoosh, swish', 0.264), ('Sound effect', 0.082), ('Explosion', 0.036)]
- params: `{"rise": 0.54777, "rise_k": 0.52167, "hold": 0.18043, "fall": 0.46182, "fall_k": 0.80483, "start_db": -40.80549, "track": 1.10776, "f_peak": 383.79493, "up_oct": 1.31345, "down_oct": 3.5, "dop_st": 10.09889, "dop_w": 0.00735, "q_air": 1.85564, "lp_ratio": 2.30354, "flut_depth": 0.24552, "flut_f": 11.22083, "rustle": 0.41154, "rustle_f": 184.73868, "low_db": -22.5034, "low_f": 400.0, "low_smooth": 0.01164, "sub_db": 2.97368, "sub_f": 40.7785, "sub_glide": 0.2995, "sub_drive": 1.04393, "hiss_db": -25.38429, "hiss_hp": 8000.0, "hiss_open": 1.00091, "hiss_pow": 1.37555, "tone_db": -36.12648, "tone_q": 60.0, "tone_ratio": 2.04871, "tone_pure": 0.74358, "grain_db": -44.21326, "grain_rate": 179.1803, "grain_f": 3284.09347, "room_wet": 0.1449, "rt60": 1.62905, "pan": 0.43748, "width": 0.37176, "drive_db": 5.72096, "end_db": -58.91009, "end_fade": 0.04419, "hiss_tail": 2.45418, "hiss_mfloor": 0.62164, "room_damp": 0.33146, "low_lag": 0.03177, "hiss_rustle": 0.00836, "hiss_lo": 662.35466, "eq_lo_db": -1.63302, "eq_lo_f": 112.10146, "eq_hi_db": -3.34696, "eq_hi_f": 2648.01106, "hiss_pre": 0.85093, "hiss_width": 0.61492, "low_width": 0.56235, "tail_sweep": 0.60465, "tail_tau": 0.23032, "hiss_q": 2.23648, "tail_gust": 0.46286, "thump_db": -34.26312, "thump_f0": 159.03301, "thump_f1": 70.0757, "thump_tau": 0.1774, "thump_lead": 0.00825}` seed 1695894544

### thump_03 (thump_03.wav)
- critic: total 2.89: match z +2.89 (best alternative +1.50); p_real 0.04 (not required: designed); sounds like: a downlifter falling sweep, a fast whoosh, a deep cinematic whoosh; clean (no artifact or polish flag)
- robust (3 new seeds): mean 2.63, min 2.47, sd 0.14, pass rate 0.00
- AudioSet (held out, decided nothing): [('Whoosh, swoosh, swish', 0.134), ('Sound effect', 0.116), ('Explosion', 0.018)]
- params: `{"rise": 0.56869, "rise_k": 0.48908, "hold": 0.18547, "fall": 0.21163, "fall_k": 0.77178, "start_db": -44.0, "track": 0.95824, "f_peak": 236.49453, "up_oct": 1.81599, "down_oct": 3.5, "dop_st": 8.65693, "dop_w": 0.01401, "q_air": 1.81966, "lp_ratio": 2.31769, "flut_depth": 0.35408, "flut_f": 8.54202, "rustle": 0.56921, "rustle_f": 256.86762, "low_db": -25.02373, "low_f": 400.0, "low_smooth": 0.00468, "sub_db": -10.54276, "sub_f": 44.82691, "sub_glide": 0.26501, "sub_drive": 0.89093, "hiss_db": -22.0673, "hiss_hp": 7804.66005, "hiss_open": 1.18944, "hiss_pow": 1.0079, "tone_db": -36.93429, "tone_q": 53.93345, "tone_ratio": 2.36382, "tone_pure": 0.84791, "grain_db": -50.0, "grain_rate": 112.34541, "grain_f": 4924.43046, "room_wet": 0.07804, "rt60": 2.0, "pan": 0.48676, "width": 0.35969, "drive_db": 6.02454, "end_db": -59.4942, "end_fade": 0.08536, "hiss_tail": 2.23549, "hiss_mfloor": 0.75441, "room_damp": 0.2743, "low_lag": 0.04006, "hiss_rustle": 0.0275, "hiss_lo": 1504.24242, "eq_lo_db": -1.16916, "eq_lo_f": 125.73071, "eq_hi_db": -3.01298, "eq_hi_f": 3911.93055, "hiss_pre": 0.43264, "hiss_width": 0.61284, "low_width": 0.50493, "tail_sweep": 0.0, "tail_tau": 0.22333, "hiss_q": 1.79307, "tail_gust": 0.52083, "thump_db": -35.3406, "thump_f0": 149.15699, "thump_f1": 86.29021, "thump_tau": 0.11563, "thump_lead": 0.02597}` seed 704885459


## Files

- WAVs: thump_01.wav, thump_02.wav, thump_03.wav
- compare.png: each pick next to its nearest reference (spectrograms, envelopes, 1/3-octave balance)
- audition.wav + audition.txt: made, ref, made, ref ... peak-matched
- report.json: everything above plus the whole search history
