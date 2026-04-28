/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

import db from "./db.mjs";

export default function seedDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        // Habitats
        const habitats = [
          [
            "Rainforest Canopy",
            "Explore the lush layers of a tropical rainforest, home to exotic birds, primates, and rare insects.",
            "rainforest.jpg",
          ],
          [
            "Savannah Plains",
            "Walk among the giants of Africa on our vast open savannah, featuring lions, elephants, and giraffes.",
            "savannah.jpg",
          ],
          [
            "Reptile World",
            "Come face to face with the ancient reptiles of our planet, from giant tortoises to venomous snakes.",
            "reptile.jpg",
          ],
          [
            "Ocean Discovery",
            "Dive into the deep with our incredible ocean habitat featuring sharks, rays, and a coral reef ecosystem.",
            "ocean.jpg",
          ],
          [
            "Arctic Tundra",
            "Experience the frozen north and meet its resilient residents — polar bears, arctic foxes, and snowy owls.",
            "arctic.jpg",
          ],
        ];

        const habitatStmt = db.prepare(
          `INSERT OR IGNORE INTO habitats (name, description, image) VALUES (?, ?, ?)`
        );
        habitats.forEach((h) => habitatStmt.run(h));
        habitatStmt.finalize();

        // Exhibits
        const exhibits = [
          [
            1,
            "Canopy Walk",
            "A thrilling treetop walkway above the rainforest floor, spotting toucans and howler monkeys.",
            "canopy-walk.jpg",
          ],
          [
            1,
            "Butterfly House",
            "A stunning enclosed garden filled with hundreds of tropical butterfly species.",
            "butterfly.jpg",
          ],
          [
            1,
            "Primate Sanctuary",
            "Meet our family of chimpanzees and orangutans in a spacious natural environment.",
            "primates.jpg",
          ],
          [
            2,
            "Lion Savannah Drive",
            "A guided jeep experience through open lion territory.",
            "lions.jpg",
          ],
          [
            2,
            "Elephant Encounter",
            "Get up close with our herd of African elephants and learn about conservation.",
            "elephants.jpg",
          ],
          [
            2,
            "Giraffe Feeding",
            "Hand-feed leaves to our towering giraffes from an elevated platform.",
            "giraffes.jpg",
          ],
          [
            3,
            "Komodo Dragon Exhibit",
            "Observe the world's largest lizard in a specially designed habitat.",
            "komodo.jpg",
          ],
          [
            3,
            "Serpent Gallery",
            "A guided tour through our collection of the world's most fascinating snakes.",
            "serpents.jpg",
          ],
          [
            4,
            "Shark Tunnel",
            "Walk through an underwater glass tunnel surrounded by sharks and rays.",
            "sharks.jpg",
          ],
          [
            4,
            "Coral Reef Tank",
            "An enormous reef tank teeming with colourful tropical fish.",
            "coral.jpg",
          ],
          [
            5,
            "Polar Bear Plunge",
            "Watch our polar bears swim and play in their Arctic pool.",
            "polarbear.jpg",
          ],
          [
            5,
            "Snowy Owl Aviary",
            "A magical walk-in aviary home to a range of Arctic birds.",
            "owls.jpg",
          ],
        ];

        const exhibitStmt = db.prepare(
          `INSERT OR IGNORE INTO exhibits (habitat_id, name, description, image) VALUES (?, ?, ?, ?)`
        );
        exhibits.forEach((e) => exhibitStmt.run(e));
        exhibitStmt.finalize();

        // Event categories
        const categories = [
          "Wildlife Festival",
          "Conservation Workshop",
          "Night Safari",
          "Guest Speaker",
          "Family Activity Day",
        ];
        const catStmt = db.prepare(`INSERT OR IGNORE INTO event_categories (name) VALUES (?)`);
        categories.forEach((c) => catStmt.run([c]));
        catStmt.finalize();

        // Events (mix of past and future, across years)
        const events = [
          [
            "Rainforest Night Safari",
            "An unforgettable evening exploring the rainforest after dark with expert guides.",
            "2026-07-12",
            3,
            "night-safari.jpg",
          ],
          [
            "Big Cat Conservation Talk",
            "Award-winning conservationist Dr. Sarah Miles discusses the future of wild lions.",
            "2026-05-18",
            4,
            "lion-talk.jpg",
          ],
          [
            "Junior Ranger Day",
            "A full day of wildlife activities designed for children aged 5–12.",
            "2026-06-07",
            5,
            "junior-ranger.jpg",
          ],
          [
            "Autumn Wildlife Festival",
            "Celebrate the season with themed wildlife displays across all habitats.",
            "2026-10-25",
            1,
            "autumn-fest.jpg",
          ],
          [
            "Ocean Conservation Workshop",
            "Hands-on workshop exploring ocean plastics and marine conservation strategies.",
            "2026-03-15",
            2,
            "ocean-workshop.jpg",
          ],
          [
            "Summer Family Safari",
            "A guided family walking safari with interactive stops at every habitat.",
            "2026-08-03",
            5,
            "family-safari.jpg",
          ],
          [
            "Reptile Discovery Day",
            "Handle safe reptiles and learn about their habitats from our keepers.",
            "2025-09-14",
            5,
            "reptile-day.jpg",
          ],
          [
            "Winter Wonderland Safari",
            "A festive evening safari with seasonal decorations and hot drinks.",
            "2025-12-20",
            3,
            "winter-safari.jpg",
          ],
          [
            "Arctic Animals Talk",
            "Expert talk on the impact of climate change on Arctic wildlife.",
            "2025-04-10",
            4,
            "arctic-talk.jpg",
          ],
          [
            "Spring Wildlife Festival",
            "Celebrate new life across the park with family-friendly events and displays.",
            "2025-03-22",
            1,
            "spring-fest.jpg",
          ],
          [
            "Savannah Sunset Experience",
            "Watch the sun set over our savannah habitat with a guided walk.",
            "2024-08-17",
            3,
            "sunset.jpg",
          ],
          [
            "Conservation Heroes Workshop",
            "Interactive workshop for teens about wildlife conservation careers.",
            "2024-11-05",
            2,
            "conservation.jpg",
          ],
        ];

        const eventStmt = db.prepare(
          `INSERT OR IGNORE INTO events (title, description, date, category_id, image) VALUES (?, ?, ?, ?, ?)`
        );
        events.forEach((e) => eventStmt.run(e));
        eventStmt.finalize();

        // Conservation projects
        const projects = [
          [
            "Rainforest Reforestation",
            "Partnering with local communities to replant thousands of native trees across threatened rainforest corridors in Borneo and the Amazon.",
            "Over 42,000 trees planted since 2022",
            "🌳",
            1,
          ],
          [
            "Coral Reef Restoration",
            "Funding research into heat-resistant coral strains and supporting reef rebuilding projects across the Great Barrier Reef and the Caribbean.",
            "3 active reef sites under restoration",
            "🪸",
            2,
          ],
          [
            "Big Cat Breeding Programme",
            "A globally coordinated breeding programme for endangered big cats, focused on preserving genetic diversity for eventual reintroduction.",
            "17 cubs born into the programme since 2020",
            "🦁",
            3,
          ],
          [
            "Plastic-Free Oceans",
            "Working with marine charities to remove plastic waste from coastlines and educating visitors about single-use alternatives.",
            "12 tonnes of plastic removed in 2025",
            "🌊",
            4,
          ],
          [
            "Pollinator Protection",
            "Planting wildflower meadows across the park to support native bees, butterflies, and other pollinators facing habitat loss.",
            "4 hectares of meadow established",
            "🐝",
            5,
          ],
          [
            "Arctic Wildlife Research",
            "Supporting field researchers tracking polar bear populations and monitoring the impact of melting sea ice on Arctic ecosystems.",
            "Funding 3 active field teams",
            "🐻‍❄️",
            6,
          ],
        ];

        const projectStmt = db.prepare(
          `INSERT OR IGNORE INTO conservation_projects (title, description, impact, icon, ordering) VALUES (?, ?, ?, ?, ?)`
        );
        projects.forEach((p) => projectStmt.run(p));
        projectStmt.finalize();

        console.log("Database seeded (this script is safe to re-run).");
        resolve();
      } catch (err) {
        console.error("Error seeding database:", err);
        return reject(err);
      }
    });
  });
}
