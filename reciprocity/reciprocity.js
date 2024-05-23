
// create dictonary for each film type for factor and minimum time needed to account for reciprocity failure
const film_types = {
    "ilford_hp5": {"factor": 1.31, "min_time": 1},
    "ilford_delta100": {"factor": 1.26, "min_time": 1},
    "ilford_delta400": {"factor": 1.41, "min_time": 1},
    "ilford_delta3200": {"factor": 1.33, "min_time": 1},
    "ilford_sfx": {"factor": 1.43, "min_time": 1},
    "ilford_fp4": {"factor": 1.26, "min_time": 1},
    "ilford_panf": {"factor": 1.33, "min_time": 1},
    "kodak_tmax100": {"factor": 1.15, "min_time": 1},
    "kodak_tmax400": {"factor": 1.24, "min_time": 1},
    "kodak_tmax3200": {"factor": 1.33, "min_time": 10},
    "kodak_portra400": {"factor": 1.33, "min_time": 1},
    "kodak_trix": {"factor": 1.54, "min_time": 1},
    "fuji_acros100": {"factor": 1.26, "min_time": 120},
    "cinestill_800t": {"factor": 1.33, "min_time": 1},
}