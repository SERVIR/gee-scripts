var plots = ee.FeatureCollection("users/billyz313/sample-plots");

var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
            .filterMetadata('CLOUD_COVER','less_than',100)
            .filterDate('2014-01-01', '2014-12-31')
            
var visParams={ 'opacity':1,'max':1, 'min' : -1,'palette':['c9c0bf','435ebf','eee8aa','006400']}

var plotsClip = l8.map(calcNDVI).mean().clip(plots)

Map.addLayer(plotsClip,visParams,"NDVI")

//Export the image to an Earth Engine asset.
Export.image.toAsset({
  image: plotsClip,
  description: 'NDVI_Clip_to_plot',
  assetId: 'clipNDVI',
  scale: 30
});

function calcNDVI(img){
        return img.expression('(i[4] - i[3]) / (i[4] + i[3])',  {'i': img}).rename(['NDVI'])
                .set('system:time_start',img.get('system:time_start'))
}