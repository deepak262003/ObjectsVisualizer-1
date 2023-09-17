

async function displayModel(modelUrl) {
    const THREE = await import('three');
    const GLTFLoader = await import('GLTFLoader');
    const OrbitControls = await import('OrbitControls');
    const RoomEnvironment = await import('RoomEnvironment');
    const MeshoptDecoder = await import('MeshoptDecoder');
    const KTX2Loader = await import('KTX2Loader');

    return new Promise((resolve) => {
        let camera, scene, renderer;
        init();
        render();

        function init() {
            const canvas = document.getElementById("three1");
            var array = new Uint8Array(modelUrl).buffer;
            const blob = new Blob([array]);
            const blobURL = URL.createObjectURL(blob);

            console.log(array);
            //arrayBuffer = "models/object1.glb"
            const arrayBuffer = blobURL;
            console.log(canvas);

            renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, canvas: canvas });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(500,300);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;


            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
            camera.position.set(-200, 100, 400);

            const environment = new RoomEnvironment.RoomEnvironment();
            const pmremGenerator = new THREE.PMREMGenerator(renderer);

            scene = new THREE.Scene();
            const axesHelper = new THREE.AxesHelper(100);
            scene.add(axesHelper);
            scene.background = new THREE.Color(0xE8E8E8);
            scene.environment = pmremGenerator.fromScene(environment).texture;

            const grid = new THREE.GridHelper(500, 10, 0xffffff, 0xffffff);
            grid.material.opacity = 0.09;
            grid.material.depthWrite = false;
            grid.material.transparent = true;
            scene.add(grid);

            const ktx2Loader = new KTX2Loader.KTX2Loader()
                .setTranscoderPath('js/libs/basis/')
                .detectSupport(renderer);

            const loader = new GLTFLoader.GLTFLoader()
            loader.setKTX2Loader(ktx2Loader);
            loader.setMeshoptDecoder(MeshoptDecoder);
            loader.load(arrayBuffer, function (gltf) {

                let mesh = gltf.scene
                const boundingBox = new THREE.Box3();
                boundingBox.setFromObject(mesh);

                let vector = new THREE.Vector3();
                let height = boundingBox.getSize(vector).y;
                let width = boundingBox.getSize(vector).x / 2;
                let length = boundingBox.getSize(vector).z / 2;

                let maxDimension
                if ((height > width) && (height > length)) {
                    maxDimension = height
                } else if (width > length) {
                    maxDimension = width
                } else {
                    maxDimension = length
                }

                let requiredMaxDimension = 200
                let requiredScale = requiredMaxDimension / maxDimension

                mesh.scale.setScalar(requiredScale)

                let boundingBox2 = new THREE.Box3();
                boundingBox2.setFromObject(mesh);

                let centeredObject = moveObjectToCenter(mesh, true)
                centeredObject.position.y = 8;
                console.log("scene executed");
                scene.add(centeredObject);
                render();
            }, (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + "% loaded");
            }, (error) => {
                console.log(error);
            });

            const controls = new OrbitControls.OrbitControls(camera, renderer.domElement);
            controls.addEventListener('change', render);
            controls.minDistance = 400;
            controls.maxDistance = 1000;
            controls.target.set(10, 90, - 16);
            controls.update();
            window.addEventListener('resize', onWindowResize);
        }
        function moveObjectToCenter(inObject, YBottomBool = false) {

            let parent = new THREE.Object3D()
            parent.add(inObject)

            let box = new THREE.Box3()
            box.setFromObject(inObject)

            let center = new THREE.Vector3()
            box.getCenter(center)

            center.negate()

            inObject.position.copy(center)

            if (YBottomBool) {
                let box2 = new THREE.Box3()
                box2.setFromObject(parent)

                let minY = box2.min.y
                let translateY = -minY
                inObject.translateY(translateY)
            }
            return parent
        }
        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

            render();

        }

        function render() {
            renderer.render(scene, camera);
        }
    })
}


