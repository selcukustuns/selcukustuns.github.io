function updateValue(spanId, value) {
    document.getElementById(spanId).innerText = value;

    // Her parametreyi kendi bağlamında güncelle
    switch (spanId) {
        case 'fovyVal':
            cameraSettings.fovy = parseFloat(value);
            updateCamera();
            break;
        case 'camPosXVal':
        case 'camPosYVal':
        case 'camPosZVal':
        case 'targetXVal':
        case 'targetYVal':
        case 'targetZVal':
            const axis = spanId.slice(3, 4).toLowerCase();
            if (spanId.startsWith('camPos')) {
                cameraSettings[`camPos${axis}`] = parseFloat(value);
            } else {
                cameraSettings[`target${axis}`] = parseFloat(value);
            }
            updateCamera();
            break;
        case 'speedVal':
            windmillSettings.speed = parseFloat(value);
            break;
        case 'posXVal':
        case 'posYVal':
        case 'posZVal':
            const posAxis = spanId.slice(3, 4).toLowerCase();
            transformSettings[`pos${posAxis.toUpperCase()}`] = parseFloat(value);
            render(); // Pozisyon değişikliği yalnızca çizimi etkiler
            break;
        case 'rotXVal':
        case 'rotYVal':
        case 'rotZVal':
        case 'scaleVal':
            const transformKey = spanId.slice(0, -3);
            transformSettings[transformKey] = parseFloat(value);
            render();
            break;
        case 'colorRVal':
        case 'colorGVal':
        case 'colorBVal':
            const colorKey = spanId.slice(5, 6).toLowerCase();
            colorSettings[`color${colorKey.toUpperCase()}`] = parseFloat(value);
            render();
            break;
    }
}
