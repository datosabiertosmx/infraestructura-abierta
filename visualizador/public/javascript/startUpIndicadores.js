var arrayInfoInstances = new Array();
var endPointIndicadores = '/edcapi/indicadores/0';
var arrayGraficaPorcentaje = [];
var arrayGraficaNumero = [];

$(document).ready(function(){
    console.log(`Ready Indicadores`);
    $("#indicadores_active").addClass("active");
    loadData(endPointIndicadores).then((data) =>{
        // console.log('### Indicadores DATA:'+JSON.stringify(data));
        if(data !== undefined){
            arrayInfoInstances = data;
            llenarNumeroProyectos(arrayInfoInstances);
            llenarPresupuestoProyectos(arrayInfoInstances);
            llenarProyectosConstruidosPorcentaje(arrayInfoInstances);
            llenarProyectosConstruidosNumero(arrayInfoInstances);
            llenarNumeroContratacionEstatus(arrayInfoInstances);
            llenarMontoContratosxMetodo(arrayInfoInstances);
            llenarTotalContratosxMetodo(arrayInfoInstances);
        }
    })
});

function llenarNumeroProyectos(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        var proyectosIdentificacion = 0;
        var proyectosPreparacion = 0;
        var proyectosImplementacion = 0;
        var proyectosTerminacion = 0;
        var proyectosTerminados = 0;
        var proyectosCancelados = 0;
        arrayInfoInstances.forEach(instancia => {
            if(instancia.data[0].length > 0 && instancia.data[0] !== undefined){
                instancia.data[0].forEach(estatus => {
                    switch (estatus.status) {
                        case 'completion':
                            proyectosTerminacion = parseFloat(proyectosTerminacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'cancelled':
                            proyectosCancelados = parseFloat(proyectosCancelados) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'implementation':
                            proyectosImplementacion = parseFloat(proyectosImplementacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'identification':
                            proyectosIdentificacion = parseFloat(proyectosIdentificacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'completed':
                            proyectosTerminados = parseFloat(proyectosTerminados) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                        case 'preparation':
                            proyectosPreparacion = parseFloat(proyectosPreparacion) + parseFloat((estatus.total_estatus === undefined ? 0 : estatus.total_estatus));
                            break;
                    
                        default:
                            break;
                    }
                });
            }
        });
        // start am5.ready()
        am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivProyectos");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);
            
            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            var chart = root.container.children.push(am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(70)
            }));

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            var series = chart.series.push(am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                alignLabels: false,
                legendLabelText: "{category}[/]",
                legendValueText: "[bold]{value}[/]"
            }));

            series.get("colors").set("colors", [
                am5.color(0xf6c6be),
                am5.color(0xF4A89C),
                am5.color(0xf16752),
                am5.color(0xdb4b36),
                am5.color(0xc63823),
                am5.color(0xa73321)
            ]);
            
            series.slices.template.set("tooltipText", "{category}: {value}");

            series.labels.template.setAll({
              textType: "circular",
              centerX: 0,
              centerY: 0
            });

            // Disabling labels and ticks
            series.labels.template.set("visible", false);
            series.ticks.template.set("visible", false);
            
            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series.data.setAll([
                { value: proyectosIdentificacion, category: "Identificación" },
                { value: proyectosPreparacion, category: "Preparación" },
                { value: proyectosImplementacion, category: "Ejecución" },
                { value: proyectosTerminacion, category: "Terminación" },
                { value: proyectosTerminados, category: "Terminado" },
                { value: proyectosCancelados, category: "Cancelado" },
            ]);
            
            // Create legend
            // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
            var legend = chart.children.push(am5.Legend.new(root, {
                centerX: am5.percent(50),
                x: am5.percent(50),
                marginTop: 15,
                marginBottom: 15,
            }));

            // Add legend
            legend.markerRectangles.template.setAll({
                cornerRadiusTL: 10,
                cornerRadiusTR: 10,
                cornerRadiusBL: 10,
                cornerRadiusBR: 10
            });
            
            legend.data.setAll(series.dataItems);

            // Play initial series animation
            // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
            series.appear(1000, 100);
            
        }); 
        // end am5.ready()
    }
}

function llenarPresupuestoProyectos(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        var montoIdentificacion = 0;
        var montoPreparacion = 0;
        var montoImplementacion = 0;
        var montoTerminacion = 0;
        var montoTerminados = 0;
        var montoCancelados = 0;
        arrayInfoInstances.forEach(instancia => {
            if(instancia.data[0].length > 0 && instancia.data[0] !== undefined){
                instancia.data[0].forEach(estatus => {
                    switch (estatus.status) {
                        case 'completion':
                            montoTerminacion = parseFloat(montoTerminacion) + parseFloat((estatus.monto === undefined ? 0 : estatus.monto));
                            break;
                        case 'cancelled':
                            montoCancelados = parseFloat(montoCancelados) + parseFloat((estatus.monto === undefined ? 0 : estatus.monto));
                            break;
                        case 'implementation':
                            montoImplementacion = parseFloat(montoImplementacion) + parseFloat((estatus.monto === undefined ? 0 : estatus.monto));
                            break;
                        case 'identification':
                            montoIdentificacion = parseFloat(montoIdentificacion) + parseFloat((estatus.monto === undefined ? 0 : estatus.monto));
                            break;
                        case 'completed':
                            montoTerminados = parseFloat(montoTerminados) + parseFloat((estatus.monto === undefined ? 0 : estatus.monto));
                            break;
                        case 'preparation':
                            montoPreparacion = parseFloat(montoPreparacion) + parseFloat((estatus.monto === undefined ? 0 : estatus.monto));
                            break;
                    
                        default:
                            break;
                    }
                    
                });
            }            
        });
        // start am5.ready()
        am5.ready(function() {
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivPresupuesto");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);          
            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false
            }));           
            chart.zoomOutButton.set("forceHidden", true);
            chart.get("colors").set("colors", [
                am5.color(0xf16752)
              ]);          
            // Data
            var data = [{
                estatus: "Identificación",
                income: montoIdentificacion
            }, {
                estatus: "Preparación",
                income: montoPreparacion
            }, {
                estatus: "Ejecución",
                income: montoImplementacion
            }, {
                estatus: "Terminación",
                income: montoTerminacion
            }, {
                estatus: "Terminado",
                income: montoTerminados
            }, {
                estatus: "Cancelado",
                income: montoCancelados
            }];          
            // Create axes (eje x y eje y)
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "estatus",
                renderer: am5xy.AxisRendererY.new(root, {
                    inversed: true,
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9
                })
            }));
            yAxis.data.setAll(data);
            var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                min: 0
            }));
            
            // Ocultar el texto del eje X
            let xRenderer = xAxis.get("renderer");
            // xRenderer.labels.template.setAll({
            //     fill: am5.color(0xFF0000),
            //     fontSize: "14px"
            // });
            xRenderer.labels.template.set("visible", false);

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function createSeries(field, name) {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueXField: field,
                    categoryYField: "estatus",
                    sequencedInterpolation: true,
                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        labelText: "[0xffffff, BOLD] $ {valueX}"
                    })
                }));

                series.bullets.push(function() {
                    return am5.Bullet.new(root, {
                        locationX: 1,
                        locationY: 0.6,
                        sprite: am5.Label.new(root, {
                            centerX: am5.p100,
                            centerY: am5.p50,
                            text: "{valueX}",
                            fill: am5.color(0xffffff),
                            populateText: true
                        })
                    });
                });

                series.data.setAll(data);
                series.appear();
                return series;
            }
            createSeries("income", "Income");
            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
            cursor.lineY.set("forceHidden", true);
            cursor.lineX.set("forceHidden", true);
            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);

            // Ocultar cuadricula
            var myTheme = am5.Theme.new(root);
            myTheme.rule("Grid").setAll({
                stroke: am5.color(0xFFFFFF),
                strokeWidth: 1
            });
            root.setThemes([
                myTheme
            ]);
        }); 
        // end am5.ready()
    }
}

function llenarProyectosConstruidosPorcentaje(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        var yearsProyecto = []; // Array de años únicos de todas las instancias
        var proyectosTerminados = []; // Array de proyectos terminados
        var proyectosPublicados = []; // Array de proyectos publicados

        //Obtener valor de años únicos
        arrayInfoInstances.forEach(instancia => {
            instancia.data[0].forEach(element => {
                if(!yearsProyecto.includes(element.yearproyecto)) {
                    yearsProyecto.push(element.yearproyecto);
                }
            });
        });
        
        // Obtener proyectos terminados
        arrayInfoInstances.forEach(instancia => {
            instancia.data[0].forEach(proyecto => {
                if(proyecto.status == 'completed'){
                    proyectosTerminados.push(proyecto)
                }
            });
        });
        
        // Obtener proyectos publicados
        arrayInfoInstances.forEach(instancia => {
            instancia.data[0].forEach(proyecto => {
                if(proyecto.proyecto_id > 0){
                    proyectosPublicados.push(proyecto)
                }
            });
        });
        
        // Ordenar Años Desc
        yearsProyecto.sort();
        // Obtener Números de proyectos terminados y publicados por año
        yearsProyecto.forEach(anio => {
            var numProyectosTerminados = proyectosTerminados.reduce((cuenta, proyecto) => {
                if(anio == proyecto.yearproyecto){
                    return cuenta + 1;
                }
                return cuenta;
            }, 0);

            var numProyectosPublicados = proyectosPublicados.reduce((cuenta, proyecto) => {
                if(anio == proyecto.yearproyecto){
                    return cuenta + 1;
                }
                return cuenta;
            }, 0);

            var porcentajeProyectosConstruidosxAnio = Math.round([numProyectosTerminados/numProyectosPublicados]*100);
            var porcentajeProyectosNoTerminadosxAnio = Math.round(100 - porcentajeProyectosConstruidosxAnio);
            var proyectosNoTerminadosxAnio = numProyectosPublicados - numProyectosTerminados;

            arrayGraficaPorcentaje.push({"category":anio, "value1": porcentajeProyectosConstruidosxAnio, "value2": porcentajeProyectosNoTerminadosxAnio});
            arrayGraficaNumero.push({"category":anio, "value1": numProyectosTerminados, "value2": proyectosNoTerminadosxAnio});
        });

        // start am4.ready Proyectos Construidos Porcentaje()
            /* Set color step */
            function am4themes_Color(target) {
                if (target instanceof am4core.ColorSet) {
                    target.list = [
                        am4core.color("#f16752"),
                        am4core.color("#F4A89C")
                    ];
                }
            }

            am4core.useTheme(am4themes_Color);

            if (chart) {
                chart.dispose();
            }

            // Create chart instance
            var chart = am4core.create("chartdivProyectosConstruidosPorcentaje", am4charts.XYChart);

            // Add data
            chart.data = arrayGraficaPorcentaje;
            chart.numberFormatter.numberFormat = "#"; 
            // Create axes
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "category";
                
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 25;

            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.max = 100;
                valueAxis.calculateTotals = true;
                valueAxis.renderer.minWidth = 50;

            // Create series
            var series1 = chart.series.push(new am4charts.ColumnSeries());
                series1.columns.template.tooltipText = "[#ffffff, BOLD] {value1} {valueY.totalPercent.formatNumber('#.00')}%";
                series1.dataFields.categoryY = "category";
                series1.dataFields.valueX = "value1";
                series1.dataFields.valueXShow = "totalPercent";

            var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
                bullet1.interactionsEnabled = false;
                bullet1.label.text = "{value1} {valueY.totalPercent.formatNumber('#.00')}%";
                bullet1.label.fill = am4core.color("#ffffff");
                bullet1.locationX = 0.95;

            var series2 = chart.series.push(new am4charts.ColumnSeries());
                series2.columns.template.width = am4core.percent(80);
                series2.columns.template.tooltipText = "[#ffffff, BOLD] {value2} {valueY.totalPercent.formatNumber('#.00')}%";
                series2.dataFields.categoryY = "category";
                series2.dataFields.valueX = "value2";
                series2.dataFields.valueXShow = "totalPercent";
                series2.dataItems.template.locations.categoryX = 0.5;
                series2.stacked = true;
                series2.tooltip.pointerOrientation = "vertical";

            var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
                bullet2.interactionsEnabled = false;
                bullet2.label.text = "{value2} {valueY.totalPercent.formatNumber('#.00')}%";
                bullet2.locationY = 0.5;
                bullet2.locationX = 0.9;
                bullet2.label.fill = am4core.color("#ffffff");

            // Set cell size in pixels
            var cellSize = 40;
            chart.events.on("datavalidated", function(ev) {
                // Get objects of interest
                var chart = ev.target;
                var categoryAxis = chart.yAxes.getIndex(0)
                // Calculate how we need to adjust chart height
                var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
                // get current chart height
                var targetHeight = chart.pixelHeight + adjustHeight;
                // Set it on chart's container
                chart.svgContainer.htmlElement.style.height = targetHeight + "px";
            });

            // Ocultar cuadricula
            valueAxis.renderer.grid.template.stroke = am4core.color("#FFFFFF");
            valueAxis.renderer.grid.template.strokeWidth = 1;
            categoryAxis.renderer.grid.template.stroke = am4core.color("#FFFFFF");
            categoryAxis.renderer.grid.template.strokeWidth = 1;

            // Ocultar el texto del eje X
            // valueAxis.renderer.labels.template.fill = (am4core.color("#FF0000"));
            // valueAxis.renderer.labels.template.fontSize = 14;
            valueAxis.renderer.labels.template.disabled = true;

        // end am4.ready()
    }
}

function llenarProyectosConstruidosNumero(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        // start am4.ready Proyectos Construidos Número()
            /* Set color step */
            function am4themes_Color(target) {
                if (target instanceof am4core.ColorSet) {
                    target.list = [
                        am4core.color("#f16752"),
                        am4core.color("#F4A89C")
                    ];
                }
            }

            am4core.useTheme(am4themes_Color);

            if (chart) {
                chart.dispose();
            }

            // Create chart instance
            var chart = am4core.create("chartdivProyectosConstruidosNumero", am4charts.XYChart);

            // Add data
            chart.data = arrayGraficaNumero;
            chart.numberFormatter.numberFormat = "#";
            // Create axes
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "category";
                
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 25;

            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.max = 100;
                valueAxis.calculateTotals = true;
                valueAxis.renderer.minWidth = 50;

            // Create series
            var series1 = chart.series.push(new am4charts.ColumnSeries());
                series1.columns.template.tooltipText = "[#ffffff, BOLD] {value1} {valueY.numberFormatter.formatNumber('#')}";
                series1.dataFields.categoryY = "category";
                series1.dataFields.valueX = "value1";
                series1.dataFields.valueXShow = "totalPercent";

            var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
                bullet1.interactionsEnabled = false;
                bullet1.label.text = "{value1} {valueY.numberFormatter.formatNumber('#.')}";
                bullet1.label.fill = am4core.color("#ffffff");
                bullet1.locationY = 0.5;
                bullet1.locationX = 0.5;

            var series2 = chart.series.push(new am4charts.ColumnSeries());
                series2.columns.template.width = am4core.percent(80);
                series2.columns.template.tooltipText = "[#ffffff, BOLD] {value2} {valueY.numberFormatter.formatNumber('#.')}";
                series2.dataFields.categoryY = "category";
                series2.dataFields.valueX = "value2";
                series2.dataFields.valueXShow = "totalPercent";
                series2.dataItems.template.locations.categoryX = 0.5;
                series2.stacked = true;
                series2.tooltip.pointerOrientation = "vertical";

            var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
                bullet2.interactionsEnabled = false;
                bullet2.label.text = "{value2} {valueY.numberFormatter.formatNumber('#.')}";
                bullet2.locationY = 0.5;
                bullet2.locationX = 0.5;
                bullet2.label.fill = am4core.color("#ffffff");

            // Set cell size in pixels
            var cellSize = 40;
            chart.events.on("datavalidated", function(ev) {
                // Get objects of interest
                var chart = ev.target;
                var categoryAxis = chart.yAxes.getIndex(0)
                // Calculate how we need to adjust chart height
                var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
                // get current chart height
                var targetHeight = chart.pixelHeight + adjustHeight;
                // Set it on chart's container
                chart.svgContainer.htmlElement.style.height = targetHeight + "px";
            });

            // Ocultar cuadricula
            valueAxis.renderer.grid.template.stroke = am4core.color("#FFFFFF");
            valueAxis.renderer.grid.template.strokeWidth = 1;
            categoryAxis.renderer.grid.template.stroke = am4core.color("#FFFFFF");
            categoryAxis.renderer.grid.template.strokeWidth = 1;

            // Ocultar el texto del eje X
            // valueAxis.renderer.labels.template.fill = (am4core.color("#FF0000"));
            // valueAxis.renderer.labels.template.fontSize = 14;
            valueAxis.renderer.labels.template.disabled = true;

        // end am4.ready()
    }
}

function llenarNumeroContratacionEstatus(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        var conteoPlaneacion = 0;
        var conteoLicitacion = 0;
        var conteoAdjudicacion = 0;
        var conteoContratacion = 0;
        var conteoEjecucion = 0;
        var conteoTerminado = 0;
        var conteoCancelado = 0;
        arrayInfoInstances.forEach(instancia => {
            if(instancia.data[1].length > 0 && instancia.data[1] !== undefined){
                instancia.data[1].forEach(estatus => {
                    if(estatus.statusimplementation != null){
                        switch (estatus.statusimplementation) {
                            case 'concluded':
                                conteoTerminado = parseFloat(conteoTerminado) + 1;
                                break;
                            case 'planning':
                            case 'ongoing':
                                conteoEjecucion = parseFloat(conteoEjecucion) + 1;
                                break;
                            default:
                                break;
                        }
                    } else if(estatus.statuscontract != null){
                        switch (estatus.statuscontract) {
                            case 'cancelled':
                                conteoCancelado = parseFloat(conteoCancelado) + 1;
                                break;
                            case 'terminated':
                                conteoTerminado = parseFloat(conteoTerminado) + 1;
                                break;
                            case 'active':
                            case 'pending':
                                conteoContratacion = parseFloat(conteoTerminado) + 1;
                                break;
                            default:
                                break;
                        }
                    } else if(estatus.statusaward != null){
                        switch (estatus.statusaward) {
                            case 'complete':
                            case 'unsuccessful':
                                conteoCancelado = parseFloat(conteoCancelado) + 1;
                                break;
                            case 'active':
                            case 'pending':
                                conteoAdjudicacion = parseFloat(conteoAdjudicacion) + 1;
                                break;
                            default:
                                break;
                        }
                    } else if(estatus.statustender != null){
                        switch (estatus.statustender) {
                            case 'complete':
                            case 'active':
                            case 'planned':
                            case 'planning':
                                conteoLicitacion = parseFloat(conteoLicitacion) + 1;
                                break;
                            case 'cancelled':
                            case 'unsuccessful':
                            case 'withdrawn':
                                conteoCancelado = parseFloat(conteoCancelado) + 1;
                                break;
                        }
                    } else {
                        conteoPlaneacion = parseFloat(conteoPlaneacion) + 1;
                    }
                });
            }
        });

        // start am5.ready()
        am5.ready(function() {

            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivProcesosContratacion");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);
            
            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            var chart = root.container.children.push(am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(70)
            }));

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            var series = chart.series.push(am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                alignLabels: false,
                legendLabelText: "{category}[/]",
                legendValueText: "[bold]{value}[/]"
            }));

            series.get("colors").set("colors", [
                am5.color(0xf2cdd2),
                am5.color(0xf6c6be),
                am5.color(0xF4A89C),
                am5.color(0xf16752),
                am5.color(0xdb4b36),
                am5.color(0xc63823),
                am5.color(0xa73321)
            ]);
            
            series.slices.template.set("tooltipText", "{category}: {value}");

            series.labels.template.setAll({
                textType: "circular",
                centerX: 0,
                centerY: 0
            });

            // Disabling labels and ticks
            series.labels.template.set("visible", false);
            series.ticks.template.set("visible", false);
            
            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series.data.setAll([
                { value: conteoPlaneacion, category: "Proceso de planeación" },
                { value: conteoLicitacion, category: "Licitación" },
                { value: conteoAdjudicacion, category: "Adjudicación" },
                { value: conteoContratacion, category: "Contrato" },
                { value: conteoEjecucion, category: "Ejecución" },
                { value: conteoTerminado, category: "Terminado" },
                { value: conteoCancelado, category: "Cancelado" },
            ]);
            
            // Create legend
            // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
            var legend = chart.children.push(am5.Legend.new(root, {
                centerX: am5.percent(50),
                x: am5.percent(50),
                layout: am5.GridLayout.new(root, {
                    maxColumns: 4,
                    fixedWidthGrid: true
                  })
            }));
            // Add legend
            legend.markerRectangles.template.setAll({
                cornerRadiusTL: 10,
                cornerRadiusTR: 10,
                cornerRadiusBL: 10,
                cornerRadiusBR: 10
            });
            
            legend.data.setAll(series.dataItems);

            // Play initial series animation
            // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
            series.appear(1000, 100);
            
        }); 
        // end am5.ready()
    }
}

function llenarMontoContratosxMetodo(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        var montoLicitacionPublica = 0;
        var montoInvitacion3Personas = 0;
        var montoAdjudicacionDirecta = 0;
        arrayInfoInstances.forEach(instancia => {
            if(instancia.data[1].length > 0 && instancia.data[1] !== undefined){
                instancia.data[1].forEach(procedimiento => {
                    switch (procedimiento.detalleprocedimiento) {
                        case 'Adjudicación directa':
                            montoAdjudicacionDirecta = parseFloat(montoAdjudicacionDirecta) + parseFloat((procedimiento.monto === undefined ? 0 : procedimiento.monto));
                            break;
                        case 'Invitación a cuando menos tres personas':
                            montoInvitacion3Personas = parseFloat(montoInvitacion3Personas) + parseFloat((procedimiento.monto === undefined ? 0 : procedimiento.monto));
                            break;
                        case 'Licitación pública':
                            montoLicitacionPublica = parseFloat(montoLicitacionPublica) + parseFloat((procedimiento.monto === undefined ? 0 : procedimiento.monto));
                            break;
                    
                        default:
                            break;
                    }
                });
            }
        });

        // start am5.ready()
        am5.ready(function() {
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivMontoContratosMetodo");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);          
            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false
            }));           
            chart.zoomOutButton.set("forceHidden", true);
            chart.get("colors").set("colors", [
                am5.color(0xf16752)
              ]);          
            // Data
            var data = [{
                procedimiento: "Licitación pública",
                income: montoLicitacionPublica
            }, {
                procedimiento: "Invitación a cuando menos tres personas",
                income: montoInvitacion3Personas
            }, {
                procedimiento: "Adjudicación directa",
                income: montoAdjudicacionDirecta
            }];          
            // Create axes (eje x y eje y)
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "procedimiento",
                renderer: am5xy.AxisRendererY.new(root, {
                    inversed: true,
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9
                })
            }));
            yAxis.data.setAll(data);
            var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                min: 0
            }));
            
            // Ocultar el texto del eje X
            let xRenderer = xAxis.get("renderer");
            // xRenderer.labels.template.setAll({
            //     fill: am5.color(0xFF0000),
            //     fontSize: "14px"
            // });
            xRenderer.labels.template.set("visible", false);

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function createSeries(field, name) {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueXField: field,
                    categoryYField: "procedimiento",
                    sequencedInterpolation: true,
                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        labelText: "[0xffffff, BOLD] $ {valueX}"
                    })
                }));

                series.bullets.push(function() {
                    return am5.Bullet.new(root, {
                        locationX: 1,
                        locationY: 0.6,
                        sprite: am5.Label.new(root, {
                            centerX: am5.p100,
                            centerY: am5.p50,
                            text: "{valueX}",
                            fill: am5.color(0xffffff),
                            populateText: true
                        })
                    });
                });

                series.data.setAll(data);
                series.appear();
                return series;
            }
            createSeries("income", "Income");
            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
            cursor.lineY.set("forceHidden", true);
            cursor.lineX.set("forceHidden", true);
            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);

            // Ocultar cuadricula
            var myTheme = am5.Theme.new(root);
            myTheme.rule("Grid").setAll({
                stroke: am5.color(0xFFFFFF),
                strokeWidth: 1
            });
            root.setThemes([
                myTheme
            ]);
        }); 
        // end am5.ready()
    }
}

function llenarTotalContratosxMetodo(arrayInfoInstances){
    if(arrayInfoInstances.length > 0){
        var totalLicitacionPublica = 0;
        var totalInvitacion3Personas = 0;
        var totalAdjudicacionDirecta = 0;
        arrayInfoInstances.forEach(instancia => {
            if(instancia.data[1].length > 0 && instancia.data[1] !== undefined){
                instancia.data[1].forEach(procedimiento => {
                    switch (procedimiento.detalleprocedimiento) {
                        case 'Adjudicación directa':
                            totalAdjudicacionDirecta = parseFloat(totalAdjudicacionDirecta) + 1;
                            break;
                        case 'Invitación a cuando menos tres personas':
                            totalInvitacion3Personas = parseFloat(totalInvitacion3Personas) + 1;
                            break;
                        case 'Licitación pública':
                            totalLicitacionPublica = parseFloat(totalLicitacionPublica) + 1;
                            break;
                    
                        default:
                            break;
                    }
                });
            }
        });

        // start am5.ready()
        am5.ready(function() {
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            var root = am5.Root.new("chartdivTotalContratosMetodo");
            
            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);          
            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false
            }));           
            chart.zoomOutButton.set("forceHidden", true);
            chart.get("colors").set("colors", [
                am5.color(0xf16752)
              ]);          
            // Data
            var data = [{
                procedimiento: "Licitación pública",
                income: totalLicitacionPublica
            }, {
                procedimiento: "Invitación a cuando menos tres personas",
                income: totalInvitacion3Personas
            }, {
                procedimiento: "Adjudicación directa",
                income: totalAdjudicacionDirecta
            }];          
            // Create axes (eje x y eje y)
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "procedimiento",
                renderer: am5xy.AxisRendererY.new(root, {
                    inversed: true,
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9
                })
            }));
            yAxis.data.setAll(data);
            var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                min: 0
            }));
            
            // Ocultar el texto del eje X
            let xRenderer = xAxis.get("renderer");
            // xRenderer.labels.template.setAll({
            //     fill: am5.color(0xFF0000),
            //     fontSize: "14px"
            // });
            xRenderer.labels.template.set("visible", false);

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function createSeries(field, name) {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueXField: field,
                    categoryYField: "procedimiento",
                    sequencedInterpolation: true,
                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        labelText: "[0xffffff, BOLD] {valueX}"
                    })
                }));

                series.bullets.push(function() {
                    return am5.Bullet.new(root, {
                        locationX: 1,
                        locationY: 0.6,
                        sprite: am5.Label.new(root, {
                            centerX: am5.p100,
                            centerY: am5.p50,
                            text: "{valueX}",
                            fill: am5.color(0xffffff),
                            populateText: true
                        })
                    });
                });

                series.data.setAll(data);
                series.appear();
                return series;
            }
            createSeries("income", "Income");
            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
            cursor.lineY.set("forceHidden", true);
            cursor.lineX.set("forceHidden", true);
            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);

            // Ocultar cuadricula
            var myTheme = am5.Theme.new(root);
            myTheme.rule("Grid").setAll({
                stroke: am5.color(0xFFFFFF),
                strokeWidth: 1
            });
            root.setThemes([
                myTheme
            ]);
        }); 
        // end am5.ready()
    }
}