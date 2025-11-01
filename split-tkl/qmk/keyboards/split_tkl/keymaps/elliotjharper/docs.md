# crash-course reminder about QMK
# --------------------------------------


# Hierarchy & Override Priority
The configuration/rules work in this order (later overrides earlier):
- QMK defaults (in quantum, tmk_core, builddefs)
- Keyboard-level keyboards/split_tkl/rules.mk and config.h
- Keymap-level keyboards/split_tkl/keymaps/elliotjharper/rules.mk and config.h

The files are layered and merged, not replaced. Each level is included and settings from more specific levels override the more general ones.

Each file is literally #included. Later #define statements override earlier ones if the same constant is redefined.

// keyboards/split_tkl/config.h
#define TAPPING_TERM 200

// keyboards/split_tkl/keymaps/elliotjharper/config.h
#define TAPPING_TERM 150  // Overrides keyboard's 200


# Links
- https://docs.qmk.fm/drivers/serial#the-pio-driver
- https://docs.qmk.fm/platformdev_rp2040
- https://docs.qmk.fm/features/split_keyboard


# Ras pi split keyboard choices

QMK split keyboard support is "serial" / "sio" / "pio"

In rp2040, you want to use "sio" or "pio".
"pio" is the only option that supports half duplex (single cable for tx and rx)