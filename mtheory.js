
const ChordNotes = {
	"Ab": ["Ab", "C", "Eb"],
	"A": ["A", "C#", "E"],
	"A#": ["A#", "D", "F"],
	"Bb": ["Bb", "D", "F"],
	"B": ["B", "D#", "F#"],
	"B#": ["C", "E", "G"],
	"Cb": ["B", "D", "F"],
	"C": ["C", "E", "G"],
	"C#": ["C#", "F", "G#"],
	"Db": ["Db", "F", "Ab"],
	"D": ["D", "F#", "A"],
	"D#": ["D#", "G", "A#"],
	"Eb": ["Eb", "G", "Bb"],
	"E": ["E", "G#", "B"],
	"E#": ["F", "A", "C"],
	"Fb": ["E", "G#", "B"],
	"F": ["F", "A", "C"],
	"F#": ["F#", "A#", "C#"],
	"Gb": ["Gb", "Bb", "Db"],
	"G": ["G", "B", "D"],
	"G#": ["G#", "C", "D#"],

	"Abm": ["Ab", "B", "Eb"],
	"Am": ["A", "C", "E"],
	"A#m": ["A#", "Db", "F"],
	"Bbm": ["Bb", "Db", "F"],
	"Bm": ["B", "D", "F#"],
	"B#m": ["C", "Eb", "G"],
	"Cbm": ["B", "Db", "F"],
	"Cm": ["C", "Eb", "G"],
	"C#m": ["C#", "Fb", "G#"],
	"Dbm": ["Db", "Fb", "Ab"],
	"Dm": ["D", "F", "A"],
	"D#m": ["D#", "Gb", "A#"],
	"Ebm": ["Eb", "Gb", "Bb"],
	"Em": ["E", "G", "B"],
	"E#m": ["F", "Ab", "C"],
	"Fbm": ["E", "G", "B"],
	"Fm": ["F", "Ab", "C"],
	"F#m": ["F#", "A", "C#"],
	"Gbm": ["Gb", "A", "Db"],
	"Gm": ["G", "Bb", "D"],
	"G#m": ["G#", "Cb", "D#"]
}


const Modes = {
	MAJOR: [2, 2, 1, 2, 2, 2, 1],
	NAT_MINOR: [2, 1, 2, 2, 1, 2, 2],
	HARM_MINOR: [2, 1, 2, 2, 1, 3, 1],
	MEL_MINOR: [[2, 1, 2, 2, 2, 2, 1], [2, 2, 1, 2, 2, 1, 2]],
	DORIAN: [2, 1, 2, 2, 2, 1, 2],
	MIXOLYDIAN: [2, 2, 1, 2, 2, 1, 2],
	PHRYGIAN_DOM: [1, 3, 1, 2, 1, 2, 2],
	MINOR_PENT_BLUES: [3, 2, 2, 3, 2]
}

class Utils {
	noteToNum(note) {
		let parsed_note = [];
		if (note[1] == "#" || note[1] == "b") {
			parsed_note[0] = note[0] + note[1];
		} else {
			parsed_note[0] = note[0];
		}
		parsed_note[1] = note[note.length - 1];
		let number = 0;
		if (parseInt(parsed_note[1])) {
			number = 12 * parsed_note[1];
		}
		switch (parsed_note[0]) {
			case "C": number += 0; break;
			case "C#": number += 1; break;
			case "Db": number += 1; break;
			case "D": number += 2; break;
			case "D#": number += 3; break;
			case "Eb": number += 3; break;
			case "E": number += 4; break;
			case "E#": number += 5; break;
			case "Fb": number += 4; break;
			case "F": number += 5; break;
			case "F#": number += 6; break;
			case "Gb": number += 6; break;
			case "G": number += 7; break;
			case "G#": number += 8; break;
			case "Ab": number += 8; break;
			case "A": number += 9; break;
			case "A#": number += 10; break;
			case "Bb": number += 10; break;
			case "B": number += 11; break;
			case "B#": number += 12; break;
			case "Cb": number += 11; break;
		}
		return number;
	}

	numToNote(number) {
		var note = "";
		switch( number % 12) {
			case 0: note = "C"; break; 
			case 1: note = "C#"; break;
			case 2: note = "D"; break;
			case 3: note = "D#"; break;
			case 4: note = "E"; break;
			case 5: note = "F"; break;
			case 6: note = "F#"; break;
			case 7: note = "G"; break;
			case 8: note = "G#"; break;
			case 9: note = "A"; break;
			case 10: note = "A#"; break;
			case 11: note = "B"; break;
		}

		note = note + Math.floor(number / 12).toString();
		return note;
	}

	step(note, num_half_steps) {
		return this.numToNote(this.noteToNumber(note) + num_half_steps);
	}

	closestNote(current_note, target) {
		var note_distances = {}
		var octave = current_note[current_note.length - 1];
		var less = target + (octave - 1);
		var same = target + (octave);
		var more = target + (parseInt(octave) + 1);

		note_distances[less] = Math.abs(this.getDistance(current_note, less));
		note_distances[same] = Math.abs(this.getDistance(current_note, same));
		note_distances[more] = Math.abs(this.getDistance(current_note, more));


		return Object.keys(note_distances).reduce(function(a, b){ return note_distances[a] < note_distances[b] ? a : b });

	}

	crossingPassages(passage1, passage2) {
		if (passage1.length != passage2.length) {
			throw "Unequal passage lengths - cannot compare crossings!";
		}
		for (let i = 0; i < passage1.length; i++) {
			if (passage1[i] == passage2[i]) {
				return true;
			}
		}
		return false;
	}

	populateVoices(chord_progression, num_voices, starting_notes) {
		if (starting_notes.length != num_voices) {
			throw "Too many or too few starting notes for the number of voices that you have.";
		}
		let voices = [];
		for (let i = 0; i < num_voices; i++) {
			voices.push([starting_notes[i]]);
			for (let j = 1; j < chord_progression.length; j++) {
				let chord = ChordNotes[chord_progression[j]];
				let okay_melody = false;
				let next_note = ""
				while (!okay_melody) {
					next_note = this.closestChordTone(voices[i][voices[i].length - 1], chord);
					okay_melody = true;
				}
				voices[i].push(next_note);
			}
		}
		return voices

		
	}

	closestChordTone(current_note, chord) {
		let note_distances = {}
		for (let i = 0; i < chord.length; i++) {
			var closest = this.closestNote(current_note, chord[i]);
			note_distances[closest] = this.getDistance(current_note, closest);
		}

		console.log(note_distances);
		return Object.keys(note_distances).reduce(function(a, b){ return Math.abs(note_distances[a]) < Math.abs(note_distances[b]) ? a : b });
	}

	getDistance(note1, note2) {
		return this.noteToNum(note1) - this.noteToNum(note2);
	}

	noteHarmonicNegative(tonic, note) {
		if(parseInt(note[note.length - 1])) {
			let offset = this.noteToNum(tonic + "0");
			let init_note = this.noteToNum(note) - offset;
			let octave = Math.floor(init_note / 12).toString();
			let axis = this.noteToNum(tonic + octave) + 3.5 - offset;
			let negative_note = init_note - (init_note - axis) * 2
			return this.numToNote(negative_note + offset);
		}
		let neg_note = this.noteHarmonicNegative(tonic, note + "4");
		return neg_note.slice(0, neg_note.length - 1);

	}

	chordHarmonicNegative(tonic, chord) {
		let notes = (typeof(chord) == String) ? ChordNotes(chord) : chord);
		return notes.map(note => this.noteHarmonicNegative(tonic, note));
	}
}

let utils = new Utils();
console.log(utils.chordHarmonicNegative("D", ["C#", "D3", "F3"]));



function mod(n, m) {
	return ((n % m) + m ) % m;
}


// Probably going to be used more for melodies
class Key {
	constructor(tonic, classifier=Modes.MAJOR) {
		this.tonic = tonic;
		this.steps = classifier;
		console.log(classifier);
	}

	scaleDegree(note) { // Zero indexed!
		let tonic_num = utils.noteToNum(this.tonic + 0);
		let note_num = (utils.noteToNum(note) - tonic_num) % 12;
		let num_steps = 0;
		for (let i = 0; i < this.steps.length; i++) {
			if (num_steps === note_num) {
				return i;
			} else {
				num_steps += this.steps[i];
			}
		}
		throw note + " is not a scale degree of " + this.tonic;

	}

	down(note, num_steps) {
		let scale_degree = this.scaleDegree(note);
		let notepos = utils.noteToNum(note);
		let steps = this.steps;
		if (steps = Modes.MEL_MINOR){
			steps = Modes.MEL_MINOR[1];
		}
		for (let i = 0; i < num_steps; i++) {
			notepos -= steps[mod(scale_degree - (i+1), steps.length)];
		}
		return utils.numToNote(notepos);



	}

	up(note, num_steps) {
		let scale_degree = this.scaleDegree(note);
		let notepos = utils.noteToNum(note);
		let steps = this.steps;
		if (steps = Modes.MEL_MINOR) {
			steps = Modes.MEL_MINOR[0];
		}
		for (let i = 0; i < num_steps; i++) {
			notepos += steps[mod(scale_degree + i, steps.length)];
		}
		return utils.numToNote(notepos);

	}
}


