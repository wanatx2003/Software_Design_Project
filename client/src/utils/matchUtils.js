// Fake zip “distance” (replace with real calc/API later)
function pseudoDistance(zipA, zipB){
  // purely for demo: numerical difference between last 2 digits
  const a = parseInt((zipA || '00000').slice(-2), 10) || 0;
  const b = parseInt((zipB || '00000').slice(-2), 10) || 0;
  return Math.abs(a - b); // "km"
}

export function scoreEventForVolunteer(volunteer, event){
  let score = 0;

  // 1) Skill overlap
  const vSkills = new Set(volunteer.skills || []);
  const required = event.requiredSkills || [];
  const overlap = required.filter(s => vSkills.has(s)).length;
  score += overlap * 10; // weight skills heavily

  // 2) Availability match (simple exact date inclusion)
  if ((volunteer.availability || []).includes(event.date)) {
    score += 8;
  }

  // 3) Distance (closer is better)
  const dist = pseudoDistance(volunteer.homeZip, event.locationZip);
  if (dist <= (volunteer.maxDistanceKm ?? 999)) {
    // inverse distance contribution
    score += Math.max(0, 10 - Math.min(dist, 10));
  } else {
    // too far → large penalty
    score -= 20;
  }

  // 4) Capacity (prefer events with open slots)
  const remaining = (event.capacity ?? 0) - (event.assignedVolunteerIds?.length ?? 0);
  if (remaining > 0) score += 5; else score -= 50;

  return score;
}

export function bestEventForVolunteer(volunteer, events){
  let best = null, bestScore = -Infinity;
  for (const e of events) {
    const s = scoreEventForVolunteer(volunteer, e);
    if (s > bestScore) { best = e; bestScore = s; }
  }
  return { event: best, score: bestScore };
}