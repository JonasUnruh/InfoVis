var margin = ({top: 30, right: 30, bottom: 60, left: 50});
var width = 1000;
var height = 600;

// Create svg
var svgLine = d3.select("#svg_line_plot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// create team data
var teamData = data[2].filter(d => d["team_name"] === "Atlanta Hawks")

// Get the keys from the data and map them to our display names for the dropdown
var keys = Object.keys(teamData[0])
keys.shift()
keys.shift()

var vars = d3.map(data[1], d => d.vars);
vars = [...new Set(vars)]

var displayNames = {};

for (i in keys) {
    displayNames[keys[i]] = vars[i]
}

// select the dropdown and add the options
var feature = d3.select("#indicator_change")
    .selectAll("option")
    .data(keys)

feature.enter()
    .append("option")
    .attr("value", d => d)
    .text(d => displayNames[d])

// add x axis
var xAxis = d3.scaleLinear()
    .domain( d3.extent(teamData, d => +d.season) )
    .range([ margin.left , width - margin.right]);
var gXAxis = svgLine.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xAxis)
    .tickFormat(d3.format("d")));


// add y axis
var yAxis = d3.scaleLinear()
    .domain( [0, d3.max(teamData, d => d.height)] )
    .range([ height - margin.bottom, margin.top ]);
var gYAxis = svgLine.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yAxis));

// intialize line with first value
var line = svgLine
    .append('g')
    .append("path")
      .datum(teamData)
      .attr("d", d3.line()
        .x(d => xAxis(+d.season))
        .y(d => yAxis(+d.height) )
      )
      .attr("stroke", "steelblue")
      .style("stroke-width", 4)
      .style("fill", "none")


// add title
var title = svgLine.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .text(`${teamData[0].team_name} ${option}`);

//function to update the chart
var update = (selectedOption) => {

    // get the selected data
    var filteredData = teamData.map(d => {return {season: d.season, option: d[selectedOption]}})
    
    // update title
    title.text(`${teamData[0].team_name} average ${displayNames[option]}`)

    // update xAxis domain
    xAxis.domain( d3.extent(filteredData, d => d.season) )

    gXAxis.transition().duration(1000)
        .call(d3.axisBottom(xAxis)
        .tickFormat(d3.format("d")));

    console.log(selectedOption)
    // update yAxis domain
    if(["fgp", "fg2p", "fg3p"].includes(selectedOption)){
        console.log("%")
        yAxis.domain( [0, d3.max(filteredData, d => d.option) * 100])

        gYAxis.transition().duration(1000)
            .call(d3.axisLeft(yAxis).tickFormat(d => d + "%"));

        // update the line with new data
        line
        .datum(filteredData)
        .transition().duration(1000)
        .attr("d", d3.line()
            .x(d => xAxis(d.season))
            .y(d => yAxis(d.option * 100)))

    } else {
        yAxis.domain( [0, d3.max(filteredData, d => d.option)])

        gYAxis.transition().duration(1000)
            .call(d3.axisLeft(yAxis));

            // update the line with new data
        line
        .datum(filteredData)
        .transition().duration(1000)
        .attr("d", d3.line()
            .x(d => xAxis(d.season))
            .y(d => yAxis(d.option)))
    }
    
    
}

// define option as global variable
var option = "nr_players"

// call update on dropdown change
var changeIndicator = (d) => {

    // Get selected option
    option = d3.select("#indicator_change").node().value

    // run update
    update(option)
}


// add event listener for team change
document.addEventListener("teamClicked", (event) => {
    var clickedData = event.detail;
    
    teamData = data[2].filter(d => d["team_name"] === clickedData)

    d3.select("#svg_line_plot").style("opacity", 1)

    update(option)
});

