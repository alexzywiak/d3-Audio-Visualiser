$(function() {
    
    var context = new AudioContext();
    var analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    $("#player").bind('canplay', function() {
        var source = context.createMediaElementSource(this);
        source.connect(analyser);
        analyser.connect(context.destination);
    });

    var width = 800,
        height = 600,
        barPadding = 0;

    var svg = d3.select('#visualiser')
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    var update = function(data) {

        rect = svg.selectAll('rect')
            .data(data)

        rect.enter().append('rect');

        rect.attr('width', function() {
                return width / data.length - barPadding;
            })
            .attr('height', function(d) {
                return d * 1000;
            })
            .attr('x', function(d, i) {
                return i * width / data.length;
            })
            .attr('y', function(d) {
                return height - d;
            })
            .attr('fill', function(d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });

    };
    update(frequencyData);
    d3.timer(function() {
        analyser.getByteFrequencyData(frequencyData);
        update(frequencyData);
    });
});