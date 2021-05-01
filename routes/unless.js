const express = require('express');
const router = express.Router();

router.post('/ss/merageFace', async(req, res, next) => {
  try {

    const womanTypes = [
        ['qc_306478_822418_20', '306478_20_1', 2018],
        ['qc_306478_829294_19', '306478_19_1', 2020],
        ['qc_306478_740787_16', '306478_16_2', 1993],
        ['qc_306478_163120_15', '306478_15_1', 1999],
        ['qc_306478_789204_12', '306478_12_1', 2010],
        ['qc_306478_254141_24', '306478_24_2', 2016],
    ]
  
  const manTypes = [
    ['qc_306478_356390_18', '306478_18_1', 2021],
    ['qc_306478_769990_17', '306478_17_2', 1993],
    ['qc_306478_394210_14', '306478_14_1', 1999],
    ['qc_306478_619518_23', '306478_23_1', 2003], 
  ]
    const types = womanTypes.concat(manTypes);
    const { ModelId, ProjectId } = req.body;
    if(types.findIndex(item => item[0] === ModelId) === -1 || ProjectId != '306478') {
      res.send({
        code: '-1'
      })
      return;
    }
    if(ProjectId != '306478') {
      res.send({
        code: '-1'
      })
      return;
    }
    // Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
    const tencentcloud = require("tencentcloud-sdk-nodejs");

    const FacefusionClient = tencentcloud.facefusion.v20181201.Client;

    const clientConfig = {
      credential: {
        secretId: "AKID7TcV5O1XgZAUvPniUzDApDLFZDcyAF2b",
        secretKey: "yh9M2ezECuLVO1MSIEyRcWML4Xk7D2bu",
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "facefusion.tencentcloudapi.com",
        },
      },
    };

    const client = new FacefusionClient(clientConfig);

    const params = req.body;

    client.FuseFace(params).then(
      (data) => {
        console.log(data);
        res.send(data);
      },
      (err) => {
        console.error("error", err);
        res.send(err);
      }
    );
  }catch(err) { next(err); }
})


router.post('/ljsy/merageFace', async(req, res, next) => {
  try {

    const womanTypes = [
        ['qc_306676_733440_8', '306676_8_1'],
        ['qc_306676_663437_6', '306676_6_1'],
        ['qc_306676_540136_4', '306676_4_1'],
        ['qc_306676_720410_2', '306676_2_1'],
    ]
    
    const manTypes = [
      ['qc_306676_144400_7', '306676_7_1'],
      ['qc_306676_263807_5', '306676_5_1'],
      ['qc_306676_626969_3', '306676_3_1'],
      ['qc_306676_400455_1', '306676_1_1'],
    ]
  
    const types = womanTypes.concat(manTypes);
    const { ModelId, ProjectId } = req.body;
    if(types.findIndex(item => item[0] === ModelId) === -1 || ProjectId != '306676') {
      res.send({
        code: '-1'
      })
      return;
    }
    // Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
    const tencentcloud = require("tencentcloud-sdk-nodejs");

    const FacefusionClient = tencentcloud.facefusion.v20181201.Client;

    const clientConfig = {
      credential: {
        secretId: "AKIDYP1PZSVGl22nHDK9G9oDQOQChA2EQpWz",
        secretKey: "f6HDwQdx2mHVVGLAONTJsnTt3vaxNXPJ",
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "facefusion.tencentcloudapi.com",
        },
      },
    };

    const client = new FacefusionClient(clientConfig);

    const params = req.body;

    client.FuseFace(params).then(
      (data) => {
        console.log(data);
        res.send(data);
      },
      (err) => {
        console.error("error", err);
        res.send(err);
      }
    );
  }catch(err) { next(err); }
})

module.exports = router;