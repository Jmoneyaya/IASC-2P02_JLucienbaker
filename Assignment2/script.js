import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth / 1.5,
    height: window.innerHeight / 1.5,
    aspectRatio: 1
}

/***********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('white')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, 20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** LIGHTS **
************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/***********
** MESHES **
************/
// torus Geometry
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2)

// torus Materials
const purpleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('purple')
})
const orangeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('orange')
})
const pinkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('pink')
})

const drawTorus = (i, material) =>
{
    const torus = new THREE.Mesh(torusGeometry, material)
    torus.position.x = (Math.random() - 0.5) * 10
    torus.position.z = (Math.random() - 0.5) * 10
    torus.position.y = i - 10


    torus.rotation.x = Math.random() * 2 * Math.PI
    torus.rotation.y = Math.random() * 2 * Math.PI
    torus.rotation.z = Math.random() * 2 * Math.PI

    torus.randomizer = Math.random()

    //caveFloor.position.set(0, -2.5, 0)
    scene.add(torus)
}


/**********************
** TEXT PARSERS & UI **
***********************/
let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'prim',
    term2: 'gale',
    term3: 'peeta',
    rotateCamera: false,
}

// Text Parsers

// Parse Text and Terms
const parseTextandTerms = () =>
{
    // Strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    //console.log(parsedText)

    // Tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)
    //console.log(uiobj.textArray)

    // Find term 1
    findTermInParsedText(uiobj.term1, purpleMaterial)

    // Find term 2
    findTermInParsedText(uiobj.term2, orangeMaterial)

    // Find term 3
    findTermInParsedText(uiobj.term3, pinkMaterial)

}

const findTermInParsedText = (term, material) =>
{
    for (let i=0; i < uiobj.textArray.length; i++)
    {
        //console.log(i, uiobj.textArray[i])
        if(uiobj.textArray[i] === term)
        {
         //console.log(i, term)
         // convert i into n, which is a value between 0 and 20
         const n = (100 / uiobj.textArray.length) * i * 0.2
         
         // call drawtorus function 5 times using converted n value
         for(let a=0; a < 5; a++)
         {
            drawTorus(n, material)
         }

        }
    }
}

// Load source text
fetch("https://raw.githubusercontent.com/pull-ups/ybigta_21winter/master/2021.%202.%204%20(%EB%AA%A9)%20wordcloud-konlpy/The%20Hunger%20Games.txt")
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data
        parseTextandTerms()
    }
    )
// UI
const ui = new dat.GUI({
    container: document.querySelector('#parent1')
})

// Interaction Folders
const createInteractionFolders = () =>
{
    // toruss Folder
    const torussFolder = ui.addFolder('Filter Terms')

    torussFolder
        .add(purpleMaterial, 'visible')
        .name(`${uiobj.term1}`)

    torussFolder
        .add(orangeMaterial, 'visible')
        .name(`${uiobj.term2}`)

    torussFolder
        .add(pinkMaterial, 'visible')
        .name(`${uiobj.term3}`)

    // Camera Folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')
}

createInteractionFolders()
/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Orbit Controls
    controls.update()

    // Camera Rotation
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()