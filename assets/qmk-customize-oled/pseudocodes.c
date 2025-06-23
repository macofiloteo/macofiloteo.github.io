// Listing 1
static const char PROGMEM new_frames_to_display[2][512] = {{...}, {...}};
// new_frames_to_display[0] is the frame for the key pressed
// new_frames_to_display[1] is the frame for the key released
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  if (record->event.pressed) {
    oled_write_raw_P(new_frames_to_display[0], 512);
  } else {
    oled_write_raw_P(new_frames_to_display[1], 512);
  }
  return true;
}

// Listing 2
const char *keycode_to_name(uint16_t keycode) {
  switch (keycode) {
  case KC_A:
    return "A";
  case KC_B:
    return "B";
    ...
  }
}

// Listing 3
if (record->event.pressed) {
  key_pressed++;
  oled_write_raw_P(new_frames_to_display[0], 525);
  oled_set_cursor(16, 4);
  const char *padding = "     "; // padding for key name display
  oled_write(padding, false);    // clear previous key name
  size_t key_name_length = strlen(keycode_to_name(keycode));
  oled_set_cursor(16 + (5 - key_name_length), 4);
  oled_write(keycode_to_name(keycode), false); // display key name

  // Code to display the total number of key presses
  sprintf(buffer, "%d", key_pressed);
  oled_set_cursor(0, 5);
  oled_write(buffer, false); // display number of key presses
  oled_set_cursor(numPlaces(key_pressed), 5);
  oled_write_P(PSTR(" Thocks!       "), false);
}

// Listing 4
bool oled_task_kb(void) {
  if (!oled_task_user()) {
    return false;
  }
  if (uptime_timer == 0) {
    uptime_timer = timer_read32();
  }
  char uptime_str[12];
  uint32_t uptime = timer_elapsed32(uptime_timer) / 1000;
  uint32_t minutes = uptime / 60;
  uint32_t hours = minutes / 60;
  sprintf(uptime_str, " %lu:%02lu:%02lu", hours, minutes % 60, uptime % 60);
  led_t led_state = host_keyboard_led_state();
  // render_bongocat();
  // oled_set_cursor(14, 0); // sets cursor to (column, row) using charactar
  // spacing (4 rows on 128x32 screen, anything more will overflow back to the
  // top) oled_write_P(PSTR("WPC:"), false);
  // oled_write(get_u8_str(get_current_wpm(), '0'), false); // writes wpm on top
  // right corner of string
  if (led_state.caps_lock) {
    oled_set_cursor(13, 0);
    oled_write_P(PSTR(" CAPS ON"), false);
  } else {
    oled_set_cursor(13, 0);
    oled_write_P(PSTR("CAPS OFF"), false);
  }
  // Yes, you can improve this by just getting the number of digits then
  // subtract it to 14 But I like to keep it simple since I wont be seeing this
  // code for the next 10 years lol
  if (hours > 99) {
    oled_set_cursor(11, 2);
  } else if (hours > 9) {
    oled_set_cursor(12, 2);
  } else {
    oled_set_cursor(13, 2);
  }
  oled_write_P(PSTR(uptime_str), false);
  return false;
}

// Listing 5
//...
bool is_pause_pressed = false;
bool is_r_pressed = false;
//...

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
  //...
  if (record->event.pressed) {
    //...
    if (keycode == KC_PAUSE) {
      is_pause_pressed = true;
    } else if (keycode == KC_R) {
      is_r_pressed = true;
    }
    //...
  } else {
    if (keycode == KC_PAUSE) {
      is_pause_pressed = false;
    } else if (keycode == KC_R) {
      is_r_pressed = false;
    }
  }
  //...
  if (is_pause_pressed && is_r_pressed) {
    key_pressed = 0;  // reset key pressed count
    uptime_timer = 0; // reset uptime
  }
}
