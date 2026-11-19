
import { useState } from "react";
import "./StudentDashboard.css";
import CampusMap from "./CampusMap/CampusMap";

const incidentsData = [
  {
    id: "SHY-103",
    type: "Security",
    zone: "A Block",
    time: "5 min ago",
    priority: "Urgent",
    status: "On Scene",
    icon: "🛡️",
    color: "blue",
  },
  {
    id: "SHY-101",
    type: "Medical",
    zone: "Hostel North",
    time: "12 min ago",
    priority: "Urgent",
    status: "Reported",
    icon: "🩺",
    color: "pink",
  },
  {
    id: "SHY-104",
    type: "Medical",
    zone: "C Block",
    time: "20 min ago",
    priority: "Urgent",
    status: "Reported",
    icon: "🩺",
    color: "pink",
  },
  {
    id: "SHY-102",
    type: "Hazard",
    zone: "Library",
    time: "28 min ago",
    priority: "Watch",
    status: "On The Way",
    icon: "⚠️",
    color: "orange",
  },
];

const emergencyTypes = [
  {
    name: "Fire",
    description: "Smoke, flames or fire alarm",
    icon: "🔥",
    color: "fire",
  },
  {
    name: "Medical",
    description: "Injury or medical emergency",
    icon: "🩺",
    color: "medical",
  },
  {
    name: "Security",
    description: "Threat or suspicious activity",
    icon: "🛡️",
    color: "security",
  },
  {
    name: "Hazard",
    description: "Spill, damage or unsafe area",
    icon: "⚠️",
    color: "hazard",
  },
];


const immediateInstructions = {
  heartAttack: {
    heading: "Possible Heart Attack / Serious Chest Pain",
    alert:
      "Call 112 immediately. Keep the person resting and stay with them.",
    steps: [
      "Call 112 or ask someone nearby to call emergency services.",
      "Keep the person resting in a comfortable position and avoid unnecessary movement.",
      "Reassure the person and keep them calm.",
      "Tell the emergency operator the person's exact campus location.",
      "Keep checking whether the person is responsive and breathing normally.",
      "Follow the emergency operator's instructions until medical help arrives."
    ],
    avoid:
      "Do not make the person walk around, drive them yourself, or delay emergency assistance."
  },

  snakeBite: {
    heading: "Snake Bite",
    alert:
      "Move away from the snake and get emergency medical help immediately.",
    steps: [
      "Move the person away from the snake without trying to catch or kill it.",
      "Keep the person calm and as still as possible.",
      "Keep the bitten limb still and avoid unnecessary movement.",
      "Remove rings, watches or tight items near the affected limb before swelling increases.",
      "Call 112 and tell responders that a snake bite has occurred.",
      "Remember the snake's appearance only if it can be done safely; do not approach it."
    ],
    avoid:
      "Do not cut the wound, suck out venom, apply a tight tourniquet, or try to catch the snake."
  },

  severeBleeding: {
    heading: "Severe Bleeding",
    alert:
      "Call 112 for serious or uncontrolled bleeding and apply firm pressure if safe.",
    steps: [
      "Call 112 or ask someone nearby to call.",
      "Use clean cloth or gauze and apply firm, continuous pressure to the wound.",
      "Keep pressure on the wound and avoid repeatedly lifting the cloth to check it.",
      "If blood soaks through, add more cloth or gauze on top and continue pressure.",
      "Keep the injured person still and reassure them.",
      "Tell responders the exact location and severity of the bleeding."
    ],
    avoid:
      "Do not remove an object deeply embedded in the wound and do not delay emergency care."
  },

  burn: {
    heading: "Serious Burn",
    alert:
      "Move away from the source of heat and get medical help for a serious burn.",
    steps: [
      "Move the person away from the heat, flame or hot object if it is safe.",
      "Cool the burned area with cool running water when appropriate.",
      "Remove jewellery or tight items near the burn before swelling develops, if they are not stuck to the skin.",
      "Cover the burn loosely with a clean, non-stick covering.",
      "Seek emergency medical help for large, deep or serious burns.",
      "Tell responders the exact location and what caused the burn."
    ],
    avoid:
      "Do not apply ice, butter, toothpaste or other household substances to a serious burn. Do not pull away clothing stuck to the skin."
  },

  fracture: {
    heading: "Possible Fracture / Serious Injury",
    alert:
      "Keep the injured area still and get medical assistance.",
    steps: [
      "Keep the injured person still and comfortable.",
      "Do not move the injured limb unnecessarily.",
      "Support the injured area in the position in which you found it.",
      "If there is severe pain, deformity or inability to use the limb, seek urgent medical help.",
      "Call 112 if the injury is severe or associated with major bleeding, loss of consciousness or breathing problems.",
      "Tell responders the exact location."
    ],
    avoid:
      "Do not try to straighten a deformed limb or force a joint back into position."
  },

  electricShock: {
    heading: "Electric Shock",
    alert:
      "Do not touch the person until the electrical source is safely disconnected.",
    steps: [
      "Stay away from exposed wires or the electrical source.",
      "Switch off the power only if it can be done safely.",
      "Do not touch the person while they may still be in contact with electricity.",
      "Call 112 and campus security or facilities staff.",
      "Once the electrical danger is safely removed, check whether the person responds and is breathing normally.",
      "Follow the emergency operator's instructions."
    ],
    avoid:
      "Do not touch the victim or electrical equipment while the power source may still be active."
  },

  choking: {
    heading: "Choking",
    alert:
      "If the person cannot breathe, speak or cough effectively, get emergency help immediately.",
    steps: [
      "Ask the person if they are choking and encourage them to cough if they can.",
      "If they cannot breathe or cough effectively, ask someone to call 112.",
      "Follow the emergency operator's instructions for appropriate choking first aid.",
      "If the person becomes unresponsive, follow the emergency operator's CPR instructions.",
      "Send someone to get an AED if one is available."
    ],
    avoid:
      "Do not give food or drink to a person who is choking and do not blindly put your fingers into their mouth."
  },

  seizure: {
    heading: "Seizure",
    alert:
      "Protect the person from injury and allow the seizure to pass without restraining them.",
    steps: [
      "Move nearby dangerous objects away from the person.",
      "Protect their head with something soft if possible.",
      "Do not restrain their movements.",
      "Do not put anything in their mouth.",
      "When the seizure stops, check whether they are breathing normally and stay with them.",
      "Call 112 if the seizure is prolonged, repeats, causes serious injury, or the person has difficulty breathing."
    ],
    avoid:
      "Do not hold the person down and do not put objects, food or medicine into their mouth during the seizure."
  },

  breathing: {
    heading: "Breathing Difficulty",
    alert:
      "Serious difficulty breathing can be life-threatening. Call 112 immediately.",
    steps: [
      "Call 112 or ask someone nearby to call.",
      "Help the person sit in a comfortable position if they are conscious.",
      "Keep them calm and avoid unnecessary movement.",
      "Move away from smoke, fumes or other obvious hazards if it is safe.",
      "Monitor whether the person remains responsive and is breathing normally.",
      "Follow the emergency operator's instructions."
    ],
    avoid:
      "Do not leave the person alone or delay emergency assistance."
  },

  poisoning: {
    heading: "Possible Poisoning / Chemical Exposure",
    alert:
      "Move away from the substance and contact emergency services.",
    steps: [
      "Move away from the source and avoid further exposure.",
      "Call 112 if the person is seriously affected or having difficulty breathing or responding.",
      "Tell responders what substance may be involved if known.",
      "If chemicals are on the skin or clothing, avoid further contact and follow emergency operator instructions.",
      "Move to fresh air if fumes are present and it is safe to do so.",
      "Do not handle an unknown substance unnecessarily."
    ],
    avoid:
      "Do not make someone vomit or give food, drink or medicines unless instructed by a medical professional or emergency operator."
  },

  security: {
    heading: "Security Threat",
    alert:
      "Move away from the threat and contact campus security or emergency services.",
    steps: [
      "Move to a safe location away from the threat.",
      "Do not approach or confront the person involved.",
      "Warn others only if it is safe to do so.",
      "Call 112 or campus security and share your exact location.",
      "If safe, stay behind a locked door or inside a secure area.",
      "Follow instructions from campus security and emergency responders."
    ],
    avoid:
      "Do not chase, confront, touch or attempt to restrain a suspicious person."
  },

  fire: {
    heading: "Fire Emergency",
    alert:
      "Move away from fire and smoke and evacuate to a safe location.",
    steps: [
      "Alert people nearby and activate the nearest fire alarm if safe.",
      "Leave using the marked emergency exit and stairs.",
      "Do not use lifts during a fire evacuation.",
      "If there is smoke, stay low and cover your nose and mouth if possible.",
      "Move to the designated safe assembly area.",
      "Call 112 and provide the exact campus block and floor."
    ],
    avoid:
      "Do not return inside or attempt to fight a large fire."
  },

  chemicalSpill: {
    heading: "Chemical Spill",
    alert:
      "Stay away from the spill and avoid touching or breathing unknown chemicals.",
    steps: [
      "Move away from the spill and keep others away.",
      "Avoid touching the substance or walking through the contaminated area.",
      "Move to fresh air if fumes are present and it is safe.",
      "Inform campus security or facilities staff immediately.",
      "Call 112 if someone is seriously affected or there is immediate danger.",
      "Tell responders what substance is involved if you know it safely."
    ],
    avoid:
      "Do not clean, smell, touch or attempt to neutralize an unknown chemical spill yourself."
  },

  accident: {
    heading: "Campus Accident",
    alert:
      "Move to a safe location and get help for anyone who may be seriously injured.",
    steps: [
      "Make sure you are not exposed to the same danger.",
      "Call 112 if anyone is seriously injured or in immediate danger.",
      "Do not unnecessarily move an injured person.",
      "Control serious bleeding with firm pressure if it is safe to do so.",
      "Keep the injured person calm and monitor their condition.",
      "Share the exact campus location with responders."
    ],
    avoid:
      "Do not move a seriously injured person unless remaining there creates an immediate danger."
  },

  generalMedical: {
    heading: "Medical Emergency",
    alert:
      "A medical emergency may require immediate professional assistance.",
    steps: [
      "Call 112 for a serious or life-threatening emergency.",
      "Tell campus medical/security staff the exact location.",
      "Keep the person safe and comfortable.",
      "Do not unnecessarily move an injured person.",
      "Monitor whether the person remains responsive and is breathing normally.",
      "Follow instructions from emergency operators and trained responders."
    ],
    avoid:
      "Do not give medicines or delay professional medical assistance unless instructed by a qualified professional."
  },

  generalHazard: {
    heading: "Unsafe Area / Hazard",
    alert:
      "Stay away from the hazard and keep other people away from the unsafe area.",
    steps: [
      "Move to a safe distance.",
      "Warn nearby people without putting yourself at risk.",
      "Do not touch damaged equipment, wires, chemicals or unstable structures.",
      "Inform campus security or facilities staff.",
      "Call 112 if there is immediate danger or serious injury.",
      "Give responders the exact location and describe the hazard."
    ],
    avoid:
      "Do not repair, clean, move or investigate an unknown hazard yourself."
  },
   
    allergicReaction: {
    heading: "Severe Allergic Reaction",
    alert:
      "A severe allergic reaction can become life-threatening. Call 112 immediately.",
    steps: [
      "Move the person away from the suspected allergen if it is safe.",
      "Call 112 or ask someone nearby to call emergency services.",
      "Help the person use their prescribed emergency medication, such as an epinephrine auto-injector, only if they have one and know how to use it.",
      "Keep the person in a comfortable position and monitor their breathing.",
      "If they become unresponsive and are not breathing normally, follow the emergency operator's CPR instructions.",
      "Tell responders what may have caused the reaction if known."
    ],
    avoid:
      "Do not leave the person alone or delay emergency assistance."
  },

  asthma: {
    heading: "Asthma / Breathing Attack",
    alert:
      "Severe breathing difficulty can be life-threatening. Call 112 if symptoms are severe or worsening.",
    steps: [
      "Help the person sit upright in a comfortable position.",
      "Keep them calm and move away from smoke, dust or other obvious triggers if safe.",
      "Help them use their own prescribed rescue inhaler if they have one.",
      "Monitor whether they can speak and breathe normally.",
      "Call 112 immediately if breathing becomes severely difficult, the person becomes exhausted, confused or unresponsive.",
      "Follow emergency operator instructions."
    ],
    avoid:
      "Do not give someone another person's medication or leave them alone during severe breathing difficulty."
  },

  unconscious: {
    heading: "Unconscious / Unresponsive Person",
    alert:
      "An unresponsive person may have a life-threatening emergency. Call 112 immediately.",
    steps: [
      "Check whether the person responds when spoken to or gently stimulated.",
      "Ask someone to call 112 and get an AED if one is available.",
      "Check whether they are breathing normally.",
      "If they are not breathing normally, follow the emergency operator's CPR instructions.",
      "If they are breathing normally, keep monitoring them and follow the operator's instructions.",
      "Tell responders the exact campus location."
    ],
    avoid:
      "Do not give food, drink or medicine to an unconscious person and do not leave them alone."
  },

  headInjury: {
    heading: "Head Injury",
    alert:
      "A serious head injury can require urgent medical assessment.",
    steps: [
      "Keep the person still and avoid unnecessary movement.",
      "Call 112 if they are unconscious, confused, repeatedly vomiting, having a seizure or becoming increasingly drowsy.",
      "Monitor their responsiveness and breathing.",
      "If there is bleeding, apply gentle pressure with clean material unless you suspect a serious skull injury.",
      "Tell responders how the injury happened and the exact location.",
      "Follow instructions from emergency operators."
    ],
    avoid:
      "Do not shake the person, force them to walk, or ignore worsening symptoms."
  },

  eyeInjury: {
    heading: "Eye Injury / Chemical in Eye",
    alert:
      "Protect the eye and seek urgent medical help, especially after chemical exposure.",
    steps: [
      "Do not rub or press the injured eye.",
      "If a chemical entered the eye, rinse it continuously with clean running water and seek emergency medical help.",
      "Remove contact lenses if they come out easily during rinsing.",
      "If an object is stuck in the eye, keep the eye still and seek urgent medical assistance.",
      "Tell responders what caused the injury if known."
    ],
    avoid:
      "Do not rub the eye, remove an embedded object, or apply medicines without professional advice."
  },

  nosebleed: {
    heading: "Heavy Nosebleed",
    alert:
      "Most nosebleeds are not life-threatening, but heavy or persistent bleeding needs medical attention.",
    steps: [
      "Sit upright and lean slightly forward.",
      "Pinch the soft part of the nose continuously for about 10 to 15 minutes.",
      "Breathe through the mouth while maintaining pressure.",
      "If bleeding remains heavy or the person feels faint or weak, call 112.",
      "Tell responders if the bleeding followed a serious injury."
    ],
    avoid:
      "Do not tilt the head backward or repeatedly release pressure to check the bleeding."
  },

  heatstroke: {
    heading: "Heat Illness / Suspected Heatstroke",
    alert:
      "Heatstroke can be life-threatening. Call 112 immediately for severe symptoms.",
    steps: [
      "Move the person to a cooler or shaded area if it is safe.",
      "Remove unnecessary outer clothing.",
      "Cool the person with cool wet cloths or other safe cooling methods.",
      "Call 112 if the person is confused, unconscious, having a seizure or severely overheated.",
      "Monitor their breathing and responsiveness.",
      "Follow emergency operator instructions."
    ],
    avoid:
      "Do not leave a severely overheated or confused person alone."
  },

  fainting: {
    heading: "Fainting / Collapse",
    alert:
      "Make sure the person is safe and check whether they recover normally.",
    steps: [
      "Protect the person from falling or nearby hazards.",
      "Check whether they respond and are breathing normally.",
      "If they regain consciousness, let them rest and recover gradually.",
      "Call 112 if they do not recover normally, have chest pain, breathing difficulty, serious injury or repeated fainting.",
      "Tell responders what happened before they fainted."
    ],
    avoid:
      "Do not force an unconscious person to eat, drink or stand up suddenly."
  },

  drowning: {
    heading: "Drowning / Water Emergency",
    alert:
      "Get emergency help immediately. Do not enter dangerous water yourself.",
    steps: [
      "Call 112 and alert trained campus personnel.",
      "Do not enter the water if doing so would put you at risk.",
      "If the person has been safely brought out, check whether they respond and are breathing normally.",
      "Follow the emergency operator's CPR instructions if they are not breathing normally.",
      "Keep the person warm and monitored while waiting for responders."
    ],
    avoid:
      "Do not put yourself in danger by entering unsafe water or attempt an untrained rescue."
  },

  animalBite: {
    heading: "Animal Bite",
    alert:
      "Move away from the animal and seek medical assessment promptly.",
    steps: [
      "Move away from the animal without attempting to catch or corner it.",
      "Wash the wound with clean running water if it is safe to do so.",
      "Apply gentle pressure with clean material if there is bleeding.",
      "Call 112 for severe bleeding or other life-threatening symptoms.",
      "Inform campus security so the animal can be handled by trained personnel.",
      "Seek medical evaluation because some animal bites may require preventive treatment."
    ],
    avoid:
      "Do not attempt to catch the animal or apply unknown substances to the wound."
  },

  insectSting: {
    heading: "Serious Insect Sting / Bite",
    alert:
      "Watch for signs of a severe allergic reaction and call 112 if they occur.",
    steps: [
      "Move away from the insect or source.",
      "If a stinger is visible, remove it carefully without repeatedly squeezing the affected area.",
      "Apply a cold pack wrapped in cloth to reduce local swelling.",
      "Watch for difficulty breathing, swelling of the face or throat, dizziness or collapse.",
      "Call 112 immediately if severe allergic symptoms develop.",
      "Tell responders what caused the sting if known."
    ],
    avoid:
      "Do not ignore rapidly worsening swelling, breathing difficulty or collapse."
  },

  diabeticEmergency: {
    heading: "Diabetic Emergency",
    alert:
      "A person with diabetes who is confused, unconscious or seriously unwell may need urgent medical help.",
    steps: [
      "Call 112 if the person is unconscious, having a seizure, severely confused or not recovering normally.",
      "If the person is fully awake and able to swallow, follow their own diabetes emergency plan if available.",
      "Stay with the person and monitor their responsiveness.",
      "If they become unconscious, do not give food or drink.",
      "Tell responders that the person may have a diabetes-related emergency."
    ],
    avoid:
      "Never give food or drink to an unconscious or unable-to-swallow person."
  },

  roadAccident: {
    heading: "Road / Vehicle Accident",
    alert:
      "Move away from traffic and other dangers and call emergency services.",
    steps: [
      "Move yourself to a safe location away from moving vehicles.",
      "Call 112 and give the exact campus location.",
      "Do not unnecessarily move an injured person unless there is immediate danger.",
      "If there is severe bleeding, apply firm pressure with clean material if safe.",
      "Warn approaching people or vehicles only when it is safe to do so.",
      "Stay with the injured person and follow emergency operator instructions."
    ],
    avoid:
      "Do not enter moving traffic or move a seriously injured person without a safety reason."
  },

  gasLeak: {
    heading: "Gas Leak / Suspected Gas Exposure",
    alert:
      "Move away from the suspected gas source and get to fresh air.",
    steps: [
      "Leave the affected area and move to fresh air.",
      "Do not operate electrical switches or create flames near a suspected gas leak.",
      "Warn others from a safe distance.",
      "Inform campus security or facilities staff.",
      "Call 112 if anyone has serious breathing difficulty, collapse or other life-threatening symptoms.",
      "Follow instructions from trained responders."
    ],
    avoid:
      "Do not investigate the leak yourself, create sparks, or attempt repairs."
  },

  electricalFire: {
    heading: "Electrical Fire / Electrical Hazard",
    alert:
      "Stay away from the electrical source and evacuate if there is fire or smoke.",
    steps: [
      "Move away from the electrical equipment and exposed wires.",
      "If there is fire or smoke, activate the fire alarm if safe and evacuate.",
      "Call 112 and inform campus security or facilities staff.",
      "Do not touch damaged electrical equipment.",
      "Do not use water on an energized electrical fire.",
      "Follow campus evacuation instructions."
    ],
    avoid:
      "Do not touch exposed wires or attempt to repair energized electrical equipment."
  },

  violence: {
    heading: "Violence / Physical Threat",
    alert:
      "Your immediate safety is the priority. Move away from the threat.",
    steps: [
      "Move to a safe location away from the person or threat.",
      "Avoid confrontation and do not attempt to physically intervene.",
      "Call 112 and campus security when it is safe to do so.",
      "If possible, stay inside a secure area and keep doors locked.",
      "Share your exact location and a brief description of the situation.",
      "Follow instructions from campus security and emergency responders."
    ],
    avoid:
      "Do not confront, chase or physically engage with the person creating the threat."
  },

  structuralCollapse: {
    heading: "Structural Damage / Building Collapse",
    alert:
      "Move away from damaged structures and follow evacuation instructions.",
    steps: [
      "Move to a safe area away from unstable walls, ceilings or structures.",
      "Evacuate if instructed or if remaining inside is unsafe.",
      "Call 112 if anyone is trapped, injured or in immediate danger.",
      "Do not enter a damaged building to rescue someone yourself.",
      "Warn others to stay away from the affected area.",
      "Tell responders the exact building and location."
    ],
    avoid:
      "Do not enter an unstable structure or disturb debris."
  },

  lightning: {
    heading: "Lightning / Severe Weather",
    alert:
      "Move indoors or into a safe enclosed building when lightning is nearby.",
    steps: [
      "Move indoors and stay away from open fields and isolated tall objects.",
      "Avoid exposed outdoor areas until the danger has passed.",
      "Follow campus weather and security instructions.",
      "If someone is struck and is unresponsive or not breathing normally, call 112 and follow CPR instructions.",
      "Tell responders the exact location."
    ],
    avoid:
      "Do not remain in open sports grounds or under isolated trees during lightning."
  },

  crowdStampede: {
    heading: "Crowd Crush / Stampede Risk",
    alert:
      "Move toward a safer area and avoid pushing against the crowd.",
    steps: [
      "Stay calm and avoid sudden pushing.",
      "Move toward the edge of the crowd or an available exit if you can do so safely.",
      "Keep your hands near your chest to protect your breathing space.",
      "Follow security staff instructions.",
      "Call 112 if someone is seriously injured or trapped.",
      "Do not return toward the crowd after reaching a safe area."
    ],
    avoid:
      "Do not push, run blindly, or stop in a narrow passageway."
  },

  suspiciousPackage: {
    heading: "Suspicious Package / Possible Threat",
    alert:
      "Do not touch or approach the suspicious object. Move away and report it.",
    steps: [
      "Move away from the object and keep others away.",
      "Do not touch, open, move or investigate it.",
      "Inform campus security immediately.",
      "Call 112 if there is immediate danger.",
      "Follow instructions from campus security and emergency responders.",
      "Do not return to the area until it has been declared safe."
    ],
    avoid:
      "Do not touch, photograph from close range, move or open a suspicious package."
  }


};

function detectEmergencyFromDescription(description, selectedType) {
  const text = description.toLowerCase();

    if (
    text.includes("allergic") ||
    text.includes("allergy") ||
    text.includes("face swelling") ||
    text.includes("throat swelling") ||
    text.includes("anaphylaxis")
  ) {
    return "allergicReaction";
  }

  if (
    text.includes("asthma") ||
    text.includes("asthma attack") ||
    text.includes("wheezing") ||
    text.includes("inhaler")
  ) {
    return "asthma";
  }

  if (
    text.includes("unconscious") ||
    text.includes("not responding") ||
    text.includes("unresponsive") ||
    text.includes("collapsed")
  ) {
    return "unconscious";
  }

  if (
    text.includes("head injury") ||
    text.includes("hit my head") ||
    text.includes("head hit") ||
    text.includes("head wound")
  ) {
    return "headInjury";
  }

  if (
    text.includes("eye injury") ||
    text.includes("chemical in eye") ||
    text.includes("something in my eye") ||
    text.includes("eye chemical")
  ) {
    return "eyeInjury";
  }

  if (
    text.includes("nosebleed") ||
    text.includes("nose bleeding") ||
    text.includes("blood from nose")
  ) {
    return "nosebleed";
  }

  if (
    text.includes("heatstroke") ||
    text.includes("heat stroke") ||
    text.includes("overheated") ||
    text.includes("heat exhaustion")
  ) {
    return "heatstroke";
  }

  if (
    text.includes("fainted") ||
    text.includes("fainting") ||
    text.includes("passed out")
  ) {
    return "fainting";
  }

  if (
    text.includes("drowning") ||
    text.includes("drowned") ||
    text.includes("fell in water")
  ) {
    return "drowning";
  }

  if (
    text.includes("dog bite") ||
    text.includes("animal bite") ||
    text.includes("dog attacked") ||
    text.includes("cat bite")
  ) {
    return "animalBite";
  }

  if (
    text.includes("bee sting") ||
    text.includes("wasp sting") ||
    text.includes("insect sting") ||
    text.includes("insect bite")
  ) {
    return "insectSting";
  }

  if (
    text.includes("diabetes") ||
    text.includes("diabetic") ||
    text.includes("low sugar") ||
    text.includes("blood sugar")
  ) {
    return "diabeticEmergency";
  }

  if (
    text.includes("road accident") ||
    text.includes("vehicle accident") ||
    text.includes("bike accident") ||
    text.includes("car accident") ||
    text.includes("vehicle hit")
  ) {
    return "roadAccident";
  }

  if (
    text.includes("gas leak") ||
    text.includes("gas smell") ||
    text.includes("gas leakage")
  ) {
    return "gasLeak";
  }

  if (
    text.includes("electrical fire") ||
    text.includes("electric fire") ||
    text.includes("electrical burning") ||
    text.includes("socket is burning")
  ) {
    return "electricalFire";
  }

  if (
    text.includes("someone is attacking") ||
    text.includes("physical attack") ||
    text.includes("violent") ||
    text.includes("violence") ||
    text.includes("being attacked")
  ) {
    return "violence";
  }

  if (
    text.includes("building collapse") ||
    text.includes("ceiling collapsed") ||
    text.includes("wall collapsed") ||
    text.includes("building damage") ||
    text.includes("structural damage")
  ) {
    return "structuralCollapse";
  }

  if (
    text.includes("lightning") ||
    text.includes("thunderstorm") ||
    text.includes("lightning strike")
  ) {
    return "lightning";
  }

  if (
    text.includes("stampede") ||
    text.includes("crowd crush") ||
    text.includes("crowd is pushing") ||
    text.includes("crowd panic")
  ) {
    return "crowdStampede";
  }

  if (
    text.includes("suspicious package") ||
    text.includes("suspicious bag") ||
    text.includes("unknown package") ||
    text.includes("bomb threat")
  ) {
    return "suspiciousPackage";
  }

  if (
    text.includes("heart attack") ||
    text.includes("chest pain") ||
    text.includes("chest pressure") ||
    text.includes("heart") ||
    text.includes("sweating") && text.includes("chest")
  ) {
    return "heartAttack";
  }

  if (
    text.includes("snake") ||
    text.includes("snake bite") ||
    text.includes("snakebite") ||
    text.includes("bitten by snake")
  ) {
    return "snakeBite";
  }

  if (
    text.includes("bleeding") ||
    text.includes("blood") ||
    text.includes("heavy bleeding") ||
    text.includes("cut badly") ||
    text.includes("deep wound")
  ) {
    return "severeBleeding";
  }

  if (
    text.includes("burn") ||
    text.includes("burned") ||
    text.includes("burnt") ||
    text.includes("scald")
  ) {
    return "burn";
  }

  if (
    text.includes("fracture") ||
    text.includes("broken bone") ||
    text.includes("broken arm") ||
    text.includes("broken leg") ||
    text.includes("dislocated")
  ) {
    return "fracture";
  }

  if (
    text.includes("electric shock") ||
    text.includes("electricity") ||
    text.includes("electric wire") ||
    text.includes("electrical wire") ||
    text.includes("electric current")
  ) {
    return "electricShock";
  }

  if (
    text.includes("choking") ||
    text.includes("choke") ||
    text.includes("can't breathe") ||
    text.includes("cannot breathe") ||
    text.includes("something stuck in throat")
  ) {
    return "choking";
  }

  if (
    text.includes("seizure") ||
    text.includes("convulsion") ||
    text.includes("fits") ||
    text.includes("fitting")
  ) {
    return "seizure";
  }

  if (
    text.includes("breathing problem") ||
    text.includes("difficulty breathing") ||
    text.includes("shortness of breath") ||
    text.includes("breathless") ||
    text.includes("can't breathe") ||
    text.includes("cannot breathe")
  ) {
    return "breathing";
  }

  if (
    text.includes("poison") ||
    text.includes("poisoning") ||
    text.includes("chemical exposure") ||
    text.includes("swallowed chemical") ||
    text.includes("toxic")
  ) {
    return "poisoning";
  }

  if (
    text.includes("chemical spill") ||
    text.includes("chemical") ||
    text.includes("acid spill") ||
    text.includes("gas leak")
  ) {
    return "chemicalSpill";
  }

  if (
    text.includes("fire") ||
    text.includes("smoke") ||
    text.includes("flames") ||
    text.includes("burning building")
  ) {
    return "fire";
  }

  if (
    text.includes("gun") ||
    text.includes("weapon") ||
    text.includes("fight") ||
    text.includes("attack") ||
    text.includes("threat") ||
    text.includes("suspicious person") ||
    text.includes("dangerous person")
  ) {
    return "security";
  }

  if (
    text.includes("accident") ||
    text.includes("collision") ||
    text.includes("crash") ||
    text.includes("fell") ||
    text.includes("fall") ||
    text.includes("injured")
  ) {
    return "accident";
  }

  if (selectedType === "Security") {
    return "security";
  }

  if (selectedType === "Fire") {
    return "fire";
  }

  if (selectedType === "Hazard") {
    return "generalHazard";
  }

  return "generalMedical";
}


export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedType, setSelectedType] = useState("Fire");
  const [selectedZone, setSelectedZone] = useState("A Block");
  const [description, setDescription] = useState("");
  const [studentName, setStudentName] = useState("Avnish");
  const [myReports, setMyReports] = useState([]);
  const [notice, setNotice] = useState("");
  const [submittedEmergency, setSubmittedEmergency] = useState(null);

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Report Emergency", icon: "＋" },
    { name: "Open Incidents", icon: "◉" },
    { name: "My Reports", icon: "▤" },
    { name: "Safety Guide", icon: "✦" },
    {name: "Campus Navigation",icon: "📍"}
  ];

  function submitReport(event) {
    event.preventDefault();

    if (!description.trim()) {
      setNotice("Please describe the emergency before submitting.");
      return;
    }

    const report = {
      id: `SHY-${105 + myReports.length}`,
      type: selectedType,
      zone: selectedZone,
      time: "Just now",
      priority: "Urgent",
      status: "Reported",
      description: description.trim(),
      icon:
        emergencyTypes.find((item) => item.name === selectedType)?.icon ||
        "🚨",
    };

    setMyReports((previous) => [report, ...previous]);
    setSubmittedEmergency({
  ...report,
  instructionType: detectEmergencyFromDescription(
    report.description,
    selectedType
  ),
});
    setDescription("");
    setNotice("Emergency reported. Follow the safety instructions below.");
  }

  function openPage(page) {
    setActivePage(page);
    setNotice("");
  }

  const allIncidents = [...myReports, ...incidentsData];

  return (
    <div className="sd-app">
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <div className="sd-brand-icon">स</div>
          <div>
            <h2>Sahayak</h2>
            <p>Campus Safety</p>
          </div>
        </div>

        <div className="sd-profile">
          <div className="sd-avatar">AS</div>
          <div>
            <h4>{studentName}</h4>
            <p>Student Account</p>
          </div>
          <span className="sd-online-dot" />
        </div>

        <p className="sd-menu-label">MAIN MENU</p>

        <nav className="sd-navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "sd-nav-item active"
                  : "sd-nav-item"
              }
              onClick={() => openPage(item.name)}
            >
              <span className="sd-nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "My Reports" && myReports.length > 0 && (
                <span className="sd-nav-count">{myReports.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sd-help-card">
          <div className="sd-help-icon">💜</div>
          <h3>Need assistance?</h3>
          <p>Stay calm. Report the situation with your campus location.</p>
          <button onClick={() => openPage("Report Emergency")}>
            Report an issue →
          </button>
        </div>

        <div className="sd-sidebar-footer">
          <span className="sd-footer-dot" />
          Demo environment
        </div>
      </aside>

      <main className="sd-main">
        <header className="sd-topbar">
          <div className="sd-breadcrumb">
            <span>Student Portal</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="sd-top-actions">
            <span className="sd-campus-pill">
              <span /> KRMU Campus
            </span>
            <button
              className="sd-notification"
              aria-label="View notifications"
              onClick={() =>
                setNotice("You are all caught up with notifications.")
              }
            >
              ♧<span />
            </button>
            <div className="sd-top-avatar">AS</div>
          </div>
        </header>

        {notice && (
          <div className="sd-notice" role="status">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}

        {activePage === "Dashboard" && (
          <>
            <section className="sd-welcome">
              <div>
                <p className="sd-eyebrow">CAMPUS SAFETY CENTER</p>
                <h1>
                  Good morning, {studentName.split(" ")[0]} <span>✦</span>
                </h1>
                <p>
                  Your safety matters. Report an emergency or check campus
                  incidents from one place.
                </p>
              </div>
              <button
                className="sd-primary-button"
                onClick={() => openPage("Report Emergency")}
              >
                <span>＋</span> Report Emergency
              </button>
              <div className="sd-welcome-decoration">✳</div>
            </section>

            <section className="sd-stats">
              <div className="sd-stat-card">
                <div className="sd-stat-icon purple">◉</div>
                <div>
                  <p>Open Incidents</p>
                  <h2>{incidentsData.length + myReports.length}</h2>
                  <span>Campus-wide reports</span>
                </div>
                <span className="sd-stat-arrow">↗</span>
              </div>

              <div className="sd-stat-card">
                <div className="sd-stat-icon green">✓</div>
                <div>
                  <p>My Reports</p>
                  <h2>{myReports.length}</h2>
                  <span>Submitted by you</span>
                </div>
                <span className="sd-stat-arrow">↗</span>
              </div>

              <div className="sd-stat-card">
                <div className="sd-stat-icon orange">⚡</div>
                <div>
                  <p>Urgent Incidents</p>
                  <h2>
                    {incidentsData.filter((item) => item.priority === "Urgent")
                      .length + myReports.length}
                  </h2>
                  <span>Needs attention</span>
                </div>
                <span className="sd-stat-arrow">↗</span>
              </div>
            </section>

            <div className="sd-content-grid">
              <section className="sd-panel sd-emergency-panel">
                <div className="sd-panel-heading">
                  <div>
                    <h2>Quick Emergency Report</h2>
                    <p>Select the type of incident you want to report.</p>
                  </div>
                  <span className="sd-heading-symbol">✳</span>
                </div>

                <div className="sd-emergency-grid">
                  {emergencyTypes.map((item) => (
                    <button
                      key={item.name}
                      className={`sd-emergency-card ${item.color}`}
                      onClick={() => {
                        setSelectedType(item.name);
                        openPage("Report Emergency");
                      }}
                    >
                      <span className="sd-emergency-icon">{item.icon}</span>
                      <strong>{item.name}</strong>
                      <span className="sd-emergency-description">
                        {item.description}
                      </span>
                      <span className="sd-card-arrow">↗</span>
                    </button>
                  ))}
                </div>

                <div className="sd-safety-note">
                  <span>ⓘ</span>
                  <p>
                    <strong>Important:</strong> This is a prototype and does
                    not contact real emergency services.
                  </p>
                </div>
              </section>

              <section className="sd-panel sd-incidents-panel">
                <div className="sd-panel-heading">
                  <div>
                    <h2>Recent Campus Incidents</h2>
                    <p>Latest reports across campus.</p>
                  </div>
                  <button
                    className="sd-view-all"
                    onClick={() => openPage("Open Incidents")}
                  >
                    View all →
                  </button>
                </div>

                <div className="sd-incident-list">
                  {allIncidents.slice(0, 4).map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                    />
                  ))}
                </div>
              </section>
            </div>

            <section className="sd-bottom-banner">
              <div className="sd-banner-icon">🛡️</div>
              <div>
                <h3>Be alert. Be safe. Help your campus.</h3>
                <p>
                  Share accurate information and never put yourself at risk
                  during an emergency.
                </p>
              </div>
              <button onClick={() => openPage("Safety Guide")}>
                Safety guidelines →
              </button>
            </section>
          </>
        )}

        {activePage === "Report Emergency" && (
          <section className="sd-page-content">
            <div className="sd-page-heading">
              <p className="sd-eyebrow">QUICK RESPONSE</p>
              <h1>Report an Emergency</h1>
              <p>Provide the incident details to create a demo report.</p>
            </div>

            <form className="sd-panel sd-report-form" onSubmit={submitReport}>
              <h2>Incident details</h2>
              <p className="sd-form-subtitle">
                Choose the type and location, then describe what happened.
              </p>

              <label className="sd-field-label">Incident type</label>
              <div className="sd-emergency-grid">
                {emergencyTypes.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={`sd-emergency-card ${item.color} ${
                      selectedType === item.name ? "selected" : ""
                    }`}
                    onClick={() => setSelectedType(item.name)}
                  >
                    <span className="sd-emergency-icon">{item.icon}</span>
                    <strong>{item.name}</strong>
                    <span className="sd-emergency-description">
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>

              <label className="sd-field-label" htmlFor="sd-zone">
                Campus zone
              </label>
              <select
                id="sd-zone"
                value={selectedZone}
                onChange={(event) => setSelectedZone(event.target.value)}
              >
                <option>A Block</option>
                <option>B Block</option>
                <option>C Block</option>
                <option>D Block</option>
                <option>Library</option>
                <option>Hostel North</option>
                <option>Hostel South</option>
                <option>Cafeteria</option>
                <option>Main Gate</option>
                <option>Parking Area</option>
                <option>Football Ground</option>
                <option>Basketball Court</option>
                <option>Cricket Ground</option>
                <option>Other</option>
              </select>

              <label className="sd-field-label" htmlFor="sd-name">
                Your name
              </label>
              <input
                id="sd-name"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                required
              />

              <label className="sd-field-label" htmlFor="sd-description">
                What is happening?
              </label>
              <textarea
                id="sd-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the situation briefly. Avoid sharing unnecessary personal information."
                rows="5"
                required
              />

              <div className="sd-safety-note">
                <span>ⓘ</span>
                <p>
                  Prototype only. No real responders or emergency services
                  will be notified.
                </p>
              </div>

              <button className="sd-primary-button sd-submit-button" type="submit">
                Submit Demo Report →
              </button>
                {submittedEmergency && (
  <div className="sd-immediate-guide">
    <div className="sd-guide-title">
      <span>🚨</span>

      <div>
        <h2>Immediate Safety Instructions</h2>
        <p>
          Follow these basic safety steps while help is on the way.
        </p>
      </div>
    </div>

    <div className="sd-guide-alert">
      {immediateInstructions[submittedEmergency.instructionType].alert}
    </div>

    <h3>
       {immediateInstructions[submittedEmergency.instructionType].heading}
    </h3>

    <ol>
       {immediateInstructions[submittedEmergency.instructionType].steps.map(
        (step, index) => (
          <li key={index}>{step}</li>
        )
      )}
    </ol>

    <div className="sd-guide-avoid">
      <strong>⚠️ Do not:</strong>
      <p>
        {immediateInstructions[submittedEmergency.instructionType].avoid}
      </p>
    </div>

    <a className="sd-emergency-call" href="tel:112">
      📞 Call Emergency Number 112
    </a>

    <p className="sd-guide-disclaimer">
      These are basic safety prompts. Follow instructions from
      emergency operators, campus security and trained responders.
    </p>
  </div>
)}
            </form>
          </section>
        )}

        {activePage === "Open Incidents" && (
          <section className="sd-page-content">
            <div className="sd-page-heading">
              <p className="sd-eyebrow">CAMPUS OVERVIEW</p>
              <h1>Open Incidents</h1>
              <p>Review reports currently displayed in this prototype.</p>
            </div>
            <section className="sd-panel sd-all-incidents">
              {allIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </section>
          </section>
        )}

        {activePage === "My Reports" && (
          <section className="sd-page-content">
            <div className="sd-page-heading">
              <p className="sd-eyebrow">YOUR ACTIVITY</p>
              <h1>My Reports</h1>
              <p>Reports submitted during this demo session.</p>
            </div>

            {myReports.length === 0 ? (
              <div className="sd-panel sd-empty-state">
                <div>📋</div>
                <h2>No reports yet</h2>
                <p>Your submitted demo reports will appear here.</p>
                <button
                  className="sd-primary-button"
                  onClick={() => openPage("Report Emergency")}
                >
                  Create a report
                </button>
              </div>
            ) : (
              <section className="sd-panel sd-all-incidents">
                {myReports.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </section>
            )}
          </section>
        )}

        {activePage === "Safety Guide" && (
          <section className="sd-page-content">
            <div className="sd-page-heading">
              <p className="sd-eyebrow">SAFETY FIRST</p>
              <h1>Campus Safety Guide</h1>
              <p>Simple steps to follow when an emergency occurs.</p>
            </div>
            <div className="sd-guide-grid">
              {[
                {
                  icon: "🔥",
                  title: "Fire emergency",
                  text: "Move away from smoke and fire. Follow marked evacuation routes and campus instructions.",
                },
                {
                  icon: "🩺",
                  title: "Medical emergency",
                  text: "Contact the appropriate campus or local emergency service. Do not move an injured person unless necessary for safety.",
                },
                {
                  icon: "🛡️",
                  title: "Security concern",
                  text: "Keep a safe distance from threats. Move to a safer location and notify authorized campus security.",
                },
                {
                  icon: "⚠️",
                  title: "Environmental hazard",
                  text: "Avoid unsafe spills or damaged areas. Warn others from a safe distance and report the location.",
                },
              ].map((item) => (
                <article className="sd-panel sd-guide-card" key={item.title}>
                  <span>{item.icon}</span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

            {activePage === "Campus Navigation" && (
  <section className="sd-page-content">
    <CampusMap />
  </section>
)}

        <footer className="sd-footer">
          <span>© 2026 Sahayak Campus Safety</span>
          <span>Student Portal · Prototype v1.0</span>
        </footer>
      </main>
    </div>
  );
}

function IncidentCard({ incident }) {
  const statusClass = incident.status.toLowerCase().replaceAll(" ", "-");

  return (
    <article className="sd-incident-card">
      <div className={`sd-incident-icon ${incident.color || "blue"}`}>
        {incident.icon}
      </div>

      <div className="sd-incident-info">
        <div className="sd-incident-title">
          <strong>{incident.id}</strong>
          <span className={`sd-priority ${incident.priority.toLowerCase()}`}>
            {incident.priority}
          </span>
        </div>
        <p>
          {incident.type} <span>·</span> {incident.zone}
        </p>
        {incident.description && <p>{incident.description}</p>}
        <small>{incident.time}</small>
      </div>

      <span className={`sd-status ${statusClass}`}>
        {incident.status}
      </span>
    </article>
  );
}
