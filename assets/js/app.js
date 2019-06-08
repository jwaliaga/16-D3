// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// function used for updating x-scale var upon click on axis label
function xScale(chosenData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(chosenData, d => d[chosenXAxis]) * 0.9,
      d3.max(chosenData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(chosenData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(chosenData, d => d[chosenYAxis])*0.9,
      d3.max(chosenData, d => d[chosenYAxis])*1.1
    ])
      .range([height, 0]);
  
    return yLinearScale;
  }

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)      
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with a transition to
// new circles
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating text group with a transition to
// new texts
function renderCirclesTextX(circlesText, newXScale, chosenXAxis) {

    circlesText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return circlesText;
  }

// function used for updating text group with a transition to
// new texts
function renderCirclesTextY(circlesText, newYScale, chosenYAxis) {

    circlesText.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return circlesText;
  }


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

    switch (chosenXAxis) {
        case "poverty":
            var Xlabel = "Poverty:";
            break;
        case "age":
            var Xlabel = "Age:";
            break;
        case "income":
            var Xlabel = "Income:";
            break;
     }

     switch (chosenYAxis) {
        case "healthcare":
            var Ylabel = "Healthcare:";
            break;
        case "smokes":
            var Ylabel = "Smokes:";
            break;
        case "obesity":
            var Ylabel = "Obesity:";
            break;
     }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])        
        .html(function (d) {
            return (`${d.state}<br>${Xlabel} ${d[chosenXAxis]}<br>${Ylabel} ${d[chosenYAxis]}`);            
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
    circlesGroup.on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
         
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (data) {
// d3.csv("assets/data/data.csv", function (err, data) {
    // if (err) throw err;
    
    // console.log(data)   

    // parse data
    data.forEach(function (dat) {
        dat.poverty = +dat.poverty;
        dat.age = +dat.age;
        dat.income = +dat.income;

        dat.obesity = +dat.obesity;
        dat.smokes = +dat.smokes;
        dat.healthcare = +dat.healthcare;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(data, chosenYAxis);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)        
        .attr("fill", "lightblue")
        .attr("opacity", ".75");
        // .on("mouseover",toolTip.show)
        // .on("mouseout",toolTip.hide);

    // append initial text to circles
    var circlesText = chartGroup.selectAll("text#circletext")
        .data(data)
        .enter()
        .append("text")
        .attr("id","circletext")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d.healthcare))        
        .attr("text-anchor","middle")
        .attr("alignment-baseline","central")
        .attr("fill","black")
        .text(d => d.abbr);

    // Create group for  3 x- axis labels
    var XlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In poverty (%)");

    var ageLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = XlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

   // Create group for  3 y- axis labels
   
   var YlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", -15)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    
    var obesityLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", -65)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");

    var smokesLabel = YlabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", -40)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    


    // append y axis
    // chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    XlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;                

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
                circlesText = renderCirclesTextX(circlesText, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                switch (chosenXAxis) {
                    case "poverty":
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "age":
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "income":
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        break;
                }
            }
        });


    // y axis labels event listener
    YlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenYAxis = value;

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(data, chosenYAxis);

                // updates y axis with transition
                yAxis = renderAxesY(yLinearScale, yAxis);

                // updates circles with new y values
                circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
                circlesText = renderCirclesTextY(circlesText, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                switch (chosenYAxis) {
                    case "obesity":
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "smokes":
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "healthcare":
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        break;
                }
            }
        });

});