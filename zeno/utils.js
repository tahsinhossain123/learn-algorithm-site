function splitTextBySections(text) {
  const lines = text.replace(/\t/g, '    ').split('\n');
  let multilineRead = false;
  return lines.reduce((acc, line) => {
    if (line.match(/\/\/ \d+$/)) {
      acc.push({
	section: parseInt(line.match(/\/\/ (\d+)$/)[1]),
	text: line.replace(/\/\/ \d+$/, '') + '\n'
      });
    } else if (line.match(/\/\/ \d+ \[$/)) {
      multilineRead = true;
      acc.push({
	section: parseInt(line.match(/\/\/ (\d+) \[$/)[1]),
	text: line.replace(/ \/\/ \d+ \[$/, '') + '\n'
      });
    } else if (line.match(/\/\/ \] \d+$/)) {
      multilineRead = false;
      acc[acc.length - 1].text += line.replace(/\/\/ \] \d+$/, '') + '\n';
    } else if (multilineRead) {
      acc[acc.length - 1].text += line + '\n';
    } else {
      if ((acc[acc.length - 1] || {}).section === -1) {
	acc[acc.length - 1].text += line + '\n';
      } else {
	acc.push({
	  section: -1,
	  text: line + '\n'
	});
      }
    }
    return acc;
  }, []);
}

function truncate_or_pad(s, length){
  if(lengthWithoutEscapes(s) > length){
    return s.substring(0, length - 3) + "..." + "\u001b[0m";
  } else {
    while(lengthWithoutEscapes(s) < length){
      s += " ";
    }
    return s;
  }
}

function lengthWithoutEscapes(s){
  return s.replace(/\u001b\[[0-9;]*m/g, "").length;
}

function interlace_strings(s1, s2, s1_max_length, s2_max_length){
  var lines = Math.max(s1.split('\n').length, s2.split('\n').length);
  var out = "";
  for(var i = 0; i < lines; i++){
    if(i < s1.split('\n').length){
      var line1 = s1.split('\n')[i];
      out += truncate_or_pad(line1, s1_max_length);
    } else {
      out +=" ".repeat(s1_max_length);
    }

    if(i < s2.split('\n').length){
      var line2 = s2.split('\n')[i];
      out += " " + truncate_or_pad(line2, s2_max_length);
    } else {
      out +=" ".repeat(s2_max_length);
    }

    if(i < lines - 1){
      out += "\n";
    }
  }

  return out;
}

function test_interlace_strings(){
  var s1 = "pizza\nhamburger\npasta\nrice\nbeans\ncrossaint\ncake\nhot dog";
  var s2 = "cat\nhorse\nelephant\nlizard\nsnowcrab\nalligator";
  console.log(interlace_strings(s1, s2, 6, 7));
}

module.exports = {
  splitTextBySections,
  truncate_or_pad,
  lengthWithoutEscapes,
  interlace_strings,
};
