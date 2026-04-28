/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

export function check() {
  console.log("🔍 Checking port configuration...\n");
  // Unset PORT is fine — index.mjs defaults to 5000. Only warn when PORT is
  // explicitly set to something other than 5000.
  const port = process.env.PORT;
  if ( port === "3030") {
    console.warn("Development mode activated! Running on port 3030.\n");
  } else if (port && port !== "5000") {
    console.warn(`Warning: running on port ${port} instead of 5000!\n`);
  } else {
    console.log("✅ Server is running on the expected port 5000.\n");
  }
}
