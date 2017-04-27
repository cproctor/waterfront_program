// Setup. Grab the div called "chart" on the page and drop in an SVG element. 
// Also define some constants. (Tweak these to change the output)
// See style.css to customize appearance.
var svg = d3.select("#chart").append("svg")
    width = 1400,
    height = 800,
    rowHeight = 50,
    rowLabelWidth = 200,
    barMinHeight = 2,
    barMaxHeight = 16,
    barUnitWidth = 60

// Create a few scale functions which take values from a domain and maps
// them to a range.

// For the height of the bar at a particular point
var barHeight = d3.scale.linear()
    .domain([0,3])
    .range([barMinHeight, barMaxHeight])

// For the width of each segment of the bar. Also used in layout that we
// want to keep consistent with the bar alignment.
function barWidth(x) {
    return x * barUnitWidth;
}

// For the spacing of data rows
function yLayout(x) {
    return (x+2) * rowHeight;
}

// Creates an area function which takes an array of data and returns 
// the appropriate SVG path string
var area = d3.svg.area()
    .x(function(d, i) { return barWidth(i)})
    .y0(function(d) { return -barHeight(d) })
    .y1(function(d) { return barHeight(d)})
    .interpolate("cardinal")

// Adding axis labels
svg.append('g')
    .attr('class', 'headers')
    .selectAll('text').data([
        {text: "TIME OF DAY", row: 0, col: 0},
        {text: "morning", row: 0, col: 1},
        {text: "afternoon", row: 2, col: 1},
        {text: "evening", row: 4, col: 1},
        {text: "SEASON", row: 6, col: 0},
        {text: "win", row: 6, col: 1},
        {text: "spr", row: 7, col: 1},
        {text: "sum", row: 8, col: 1},
        {text: "aut", row: 9, col: 1},
        {text: "DAY OF WEEK", row: 10, col: 0},
        {text: "m", row: 10, col: 1},
        {text: "t", row: 11, col: 1},
        {text: "w", row: 12, col: 1},
        {text: "t", row: 13, col: 1},
        {text: "f", row: 14, col: 1},
        {text: "s", row: 15, col: 1},
        {text: "s", row: 16, col: 1},
    
    ]).enter().append('text')
        .text(function(d){return d.text})
        .attr('x', function(d) {return rowLabelWidth + barWidth(d.row)})
        .attr('y', function(d) {return 40 + 20 * d.col})
    
// The rest of the program is contained within this function.
// In short, read the datafile, split each row into separate 
// series (daily, seasonal, and weekly), and then create 
d3.text("data.csv", function(text) {
    var data = d3.csv.parseRows(text).map(function(row) {
        nums = row.slice(1).map(function(d) { return +d;})
        return {
            name: row[0],
            daily: nums.slice(0,6),
            seasonal: nums.slice(6, 10),
            weekly: nums.slice(10)
        }
    })
    console.log(data)
    var rows = svg.selectAll('g.row').data(data)
    var newRows = rows.enter().append('g')
        .attr("transform", function(d, i) {return "translate(0," + yLayout(i)+ ")"})
        .attr('class', 'row')
    newRows.append('text')
        .text(function(d) {return d.name})
        .attr('x', 0)
        .attr('y', 0)
    newRows.append("path")
        .attr("transform", "translate(" + (rowLabelWidth) + ",0)")
        .datum(function(d) { return d.daily})
        .attr("d", area);
    newRows.append("path")
        .attr("transform", "translate(" + (rowLabelWidth + barWidth(6)) + ",0)")
        .datum(function(d) { return d.seasonal})
        .attr("d", area);
    newRows.append("path")
        .attr("transform", "translate(" + (rowLabelWidth + barWidth(10)) + ",0)")
        .datum(function(d) { return d.weekly})
        .attr("d", area);
})

