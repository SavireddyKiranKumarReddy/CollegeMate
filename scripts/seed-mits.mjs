// Seed real MITS workspace data: departments + verified facts from official-site research.
// Requires supabase/migrations/20261006_knowledge.sql to be applied first.
// Idempotent: skips departments by code and facts by question text.
// Usage: node scripts/seed-mits.mjs
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function env() {
  const out = {};
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !line.trim().startsWith("#")) out[m[1]] = m[2];
  }
  return out;
}
const e = env();
const sb = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const SRC = "mits.ac.in (official site, Oct 2026)";

const { data: college } = await sb.from("colleges").select("id").eq("domain", "mits-madanapalle").maybeSingle();
if (!college) throw new Error("mits-madanapalle college not found");
const cid = college.id;

const { data: existingDepts } = await sb.from("departments").select("id,code").eq("college_id", cid);
const have = new Set((existingDepts || []).map((d) => (d.code || "").toUpperCase()));
const NEW_DEPTS = [
  ["Examinations", "EXM"],
  ["Library", "LIB"],
  ["Student Support", "SUP"],
  ["Clubs & Student Life", "CLB"],
];
const deptId = {};
for (const d of existingDepts || []) deptId[(d.code || "").toUpperCase()] = d.id;
for (const [name, code] of NEW_DEPTS) {
  if (have.has(code)) continue;
  const { data, error } = await sb.from("departments").insert({ college_id: cid, name, code }).select("id").single();
  if (error) throw error;
  deptId[code] = data.id;
  console.log("dept added:", code, name);
}

const FACTS = [
  ["ADM", "institution", "What is the full name and current status of MITS?", "Madanapalle Institute of Technology and Science. It is a Deemed to be University under Section 3 of the UGC Act, 1956 (Government of India notification dated 15 July 2025), established in 1998."],
  ["ADM", "institution", "Is MITS autonomous or a university?", "MITS is a Deemed to be University since 15 July 2025. Older pages mentioning autonomous or JNTUA status reflect its earlier historical structure."],
  ["ADM", "location", "Where is MITS located and how big is the campus?", "Madanapalle, Andhra Pradesh, on the Madanapalle-Kadiri/Anantapur Highway (NH-42) near Angallu, roughly 10 km from Madanapalle. The campus spans 26.17 acres."],
  ["ADM", "recognition", "Which recognitions and accreditations does MITS hold?", "UGC Deemed-to-be University, NAAC A+, NBA-accredited programs including Civil, CSE, ECE, EEE, Mechanical, MBA and MCA, AICTE approval, ISO 21001:2018, UGC recognition, recognised research centre, and DSIR-recognised Scientific and Industrial Research Organization."],
  ["ADM", "academics", "What schools and programs does MITS offer?", "School of Engineering (Civil, EEE, Mechanical, ECE, Bioinformatics), School of Computing (CSE, CSE Data Science, CSE Cyber Security, BCA, MCA), School of Management (BBA, MBA), and School of AI and ML (AI, AI and ML, AI and Data Science, AI and Robotics). PG includes M.Tech specialisations, MBA and MCA, plus Ph.D. and research programs."],
  ["ADM", "research", "Does MITS support research and entrepreneurship?", "Yes. MITS has research centres, doctoral research, industry partnerships, consultancy, and a dedicated Venture-Studio section for entrepreneurship and venture development."],
  ["ADM", "finance", "Where do I find the fee structure and scholarships?", "The MITS website has dedicated sections for fee structure, scholarships, tuition-fee payment and student financial information."],
  ["ADM", "campus", "What campus facilities does MITS have?", "A 26.17-acre campus with laboratories, smart classrooms, seminar halls, library, auditorium, sports facilities and academic buildings. A dedicated Facilities section exists on the official site."],
  ["EXM", "exams", "Where are exam timetables, calendars and results published?", "The MITS website has dedicated sections for academic regulations, academic calendars, curriculum, examinations, timetables and results."],
  ["CLB", "clubs", "What student clubs can I join at MITS?", "14 officially recognized clubs: Arts and Cultural, Film Makers, Sports, MSR, Web, Tech, Coding, Builders, Literary, Yoga and Meditation, SKILL BEE, Anchors, Entrepreneurship Development Cell, and Drone Technology. They conduct programs, events and meetings through the academic year."],
  ["CLB", "activities", "What student activities happen at MITS?", "Activities run through clubs and institutional cells via the Student Activity Centre (SAC): AI Learning Hub events, Annual Day, workshops, Anti-Ragging Week, rallies, technical and cultural activities, sports, and NSS/NCC activities."],
  ["CLB", "ncc", "Does MITS have NCC?", "Yes. The NCC Army unit started in 2016, attached to the 35 Andhra Battalion, Chittoor, under Tirupati Headquarters, with a stated strength of 108 cadets."],
  ["CLB", "nss", "Does MITS have NSS?", "Yes. NSS is listed among the official institutional cells."],
  ["SUP", "support", "What student support cells exist at MITS?", "Grievance Redressal, Anti-Ragging, Minority, SC and ST, Internal Complaints, Psychological Counselling, Women Empowerment, Student Welfare, Student Activity Centre, Mentor-Mentee, Alumni cells, plus NSS and NCC."],
  ["SUP", "safety", "What is the anti-ragging policy at MITS?", "MITS states a zero-tolerance approach toward ragging, with a 2026-27 Anti-Ragging Policy, SOP and committee information published on its anti-ragging page."],
  ["SUP", "safety", "Where can harassment complaints be reported at MITS?", "MITS has an Internal Complaints Committee for prevention and redressal of sexual harassment, with an institutional zero-tolerance policy."],
  ["SUP", "support", "Is there mentoring or counselling support at MITS?", "Yes. A Mentor-Mentee system with mentors, coordinators, interaction schedules, forms and guidelines, plus counselling support."],
  ["PLC", "placements", "What is the placement record at MITS?", "As published by MITS: 5000+ recruiters engaged, a highest salary package of 20 lakh rupees mentioned on the placement page, and 50+ companies offering packages. Mandatory disclosure figures: 2023-24: 60.03% placed, 13 LPA highest, 3.9 LPA median; 2024-25: 61.98%, 29.5 LPA highest, 4.01 LPA median; 2025-26: 46.29%, 23 LPA highest, 3.6 LPA median (later years marked as stated in the disclosure)."],
  ["PLC", "placements", "What placement support does MITS provide?", "Placement procedure, training calendar, interview preparation, online practice resources, recruiter engagement, placement statistics, career guidance, resume preparation, interview skills, internship opportunities and higher-education guidance."],
];

const { data: existing } = await sb.from("knowledge_facts").select("question").eq("college_id", cid);
const seen = new Set((existing || []).map((f) => f.question.trim().toLowerCase()));
let added = 0, skipped = 0;
for (const [code, topic, question, answer] of FACTS) {
  if (seen.has(question.trim().toLowerCase())) { skipped++; continue; }
  const { error } = await sb.from("knowledge_facts").insert({
    college_id: cid,
    department_id: deptId[code] || null,
    question, answer, topic,
    source_label: SRC,
    source_document_id: null,
    status: "verified",
    created_by: "research-seed",
  });
  if (error) throw error;
  added++;
}
console.log(`facts added: ${added}, skipped (already present): ${skipped}`);
