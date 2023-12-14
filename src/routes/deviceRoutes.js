const express = require('express');
const router = express.Router();
const Device = require('../models/device');
const multer = require('multer');
const upload = multer();
const devices = [];

router.post('/', (req, res) => {
  const { deviceId, deviceName, description, serialNumber, manufacturer, assignedUser} = req.body;
  const newDevice = new Device(deviceId, deviceName, description, serialNumber, manufacturer, null);
  devices.push(newDevice);
  res.status(201).json(newDevice);
});

router.get('/', (req, res) => {
  const filteredDevices = devices.map(device => ({
    deviceId: device.deviceId,
    deviceName: device.deviceName,
    description: device.description,
    serialNumber: device.serialNumber,
    manufacturer: device.manufacturer,
    assignedUser: device.assignedUser,
  }));

  res.status(200).json(filteredDevices);
});

router.get('/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  const device = devices.find((d) => d.deviceId === deviceId);

  if (device) {
    res.status(200).json(device);
  } else {
    res.status(404).send('Device not found');
  }
});

router.put('/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  const { deviceName, description, serialNumber, manufacturer} = req.body;
  const deviceIndex = devices.findIndex((d) => d.deviceId === deviceId);

  if (deviceIndex !== -1) {
    devices[deviceIndex] = {
      ...devices[deviceIndex],
      deviceName,
      description,
      serialNumber,
      manufacturer,
    };
    res.status(200).json(devices[deviceIndex]);
  } else {
    res.status(404).send('Device not found');
  }
});

router.delete('/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  const deviceIndex = devices.findIndex((d) => d.deviceId === deviceId);

  if (deviceIndex !== -1) {
    const deletedDevice = devices.splice(deviceIndex, 1)[0];
    res.status(200).json(deletedDevice);
  } else {
    res.status(404).send('Device not found');
  }
});

router.put('/:deviceId/user', (req, res) => {
  const deviceId = req.params.deviceId;
  const userId = req.body.userId;

  const device = devices.find((d) => d.deviceId === deviceId);

  if (device) {
    device.assignedUser = userId;
    res.status(200).send('Device assigned to user successfully');
  } else {
    res.status(404).send('Device not found');
  }
});

router.delete('/:deviceId/user', (req, res) => {
  const deviceId = req.params.deviceId;
  const device = devices.find((d) => d.deviceId === deviceId);

  if (device) {
    device.assignedUser = null;
    res.status(200).send('Device unassigned from user successfully');
  } else {
    res.status(404).send('Device not found');
  }
});

router.put('/:deviceId/photo', upload.single('photo'), (req, res) => {
  const deviceId = req.params.deviceId;
  const deviceIndex = devices.findIndex((d) => d.deviceId === deviceId);

  if (deviceIndex !== -1) {
    if (req.file) {
      const photoData = req.file.buffer.toString('base64');
      devices[deviceIndex].photoUrl = `data:image/png;base64,${photoData}`;
      res.status(200).send('Photo added to device successfully');
    } else {
      res.status(400).json({ error: 'No photo provided' });
    }
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

router.get('/:deviceId/photo', (req, res) => {
  const deviceId = req.params.deviceId;
  const device = devices.find((d) => d.deviceId === deviceId);

  if (device && device.photoUrl) {
    const base64Data = device.photoUrl.replace(/^data:image\/png;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': binaryData.length,
    });
    res.end(binaryData, 'binary');
  } else {
    res.status(404).sendFile('public/image.jpg');
  }
});

module.exports = router;
