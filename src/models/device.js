class Device {
  constructor(deviceId, deviceName, description, serialNumber, manufacturer, assignedUser) {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    this.description = description;
    this.serialNumber = serialNumber;
    this.manufacturer = manufacturer;
    this.assignedUser = assignedUser; 
  }
}

module.exports = Device;
