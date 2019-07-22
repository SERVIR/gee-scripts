var plots = ee.FeatureCollection("users/billyz313/sample-plots");

var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
            .filterMetadata('CLOUD_COVER','less_than',100)
            .filterDate('2014-01-01', '2014-12-31')
            

var NDVIPlotsClipped = l8.filterBounds(plots).map(calcNDVI)

var nImages = NDVIPlotsClipped.size().getInfo()
var icList = NDVIPlotsClipped.toList(nImages)

for (var i=0; i < nImages; i++) {
  var thisImg = ee.Image(icList.get(i))
  //Export the image to an Earth Engine asset.
  Export.image.toAsset({
    image: thisImg,
    description: 'NDVI_Clip_to_plot',
    assetId: 'users/billyz313/clippedNDVICollection/clipNDVI'+i.toString(),
    scale: 50,
    maxPixels: 1.0E13
  });
}

function calcNDVI(img){
        return img.expression('(i[4] - i[3]) / (i[4] + i[3])',  {'i': img}).rename(['NDVI'])
                .set('system:time_start',img.get('system:time_start')).clip(plots)
}