async function threejs1() {
    const THREE = await import('three');
    const GLTFLoader = await import('GLTFLoader');
    const OrbitControls = await import('OrbitControls');
    console.log(THREE);

    const canvas = document.getElementById("three1");
    console.log(canvas);


    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#9e9493");
    const sizes = {
        width: 800,
        height: 500,
    }
    let center = new THREE.Vector3();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 1, 2);
    camera.lookAt(center);
    scene.add(camera);
    console.log(scene);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);

    const loader = new GLTFLoader.GLTFLoader();
    loader.load("models/object1.glb", (glb) => {
        console.log(glb);
        const model = glb.scene;
        const desiredSize = 2;
        const boundingBox = new THREE.Box3().setFromObject(model);

        const size = boundingBox.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = desiredSize / maxDim;
        console.log(scaleFactor);

        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        model.position.set(0, -0.75, 0);
        center = boundingBox.getCenter(new THREE.Vector3());
        // console.log(center);


        scene.add(model);
    }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    }, (error) => {
        console.log(error);
    })

    const renderer = new THREE.WebGLRenderer({ canvas });
    const controls = new OrbitControls.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    console.log(renderer);

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
    }

    animate();
}

threejs1();