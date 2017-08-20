const socket = io();

const sensorOne = document.querySelector('[data-sensor-one]');
const sensorTwo = document.querySelector('[data-sensor-two]');

const update = values => {
    sensorOne.innerHTML = `${values.sensorOne}%`;
    sensorTwo.innerHTML = `${values.sensorTwo}%`;
};

socket.on('update', values => update(values));

jQuery(document).ready(function($) {
    $.plot($('.chart'), [
            [
                [0, 90], [1, 75], [2, 50], [3, 70], [4, 50], [5, 40], [6, 65]
            ],
            [
                [0, 25], [1, 35], [2, 25], [3, 15], [4, 30], [5, 15], [6, 20]
            ],
            [
                [0, 35], [1, 50], [2, 40], [3, 25], [4, 20], [5, 30], [6, 10]
            ]
        ],
        {
            yaxis: {
                max: 100
            },
            series: {
                curvedLines: {
                    apply: true,
                    active: true,
                    monotonicFit: true
                },
                lines: {
                    show: true,
                    lineWidth: 0,
                    fill: true,
                    fillColor: {
                        colors: [
                            { opacity: 0 },
                            { opacity: 0.5 }
                        ]
                    }
                }
            },
            legend: {
                show: false
            },
            grid: {
                show: false
            },
            colors: [
                '#ffffff',
                '#ffffff',
                '#ffffff'
            ]
        }
    );
});