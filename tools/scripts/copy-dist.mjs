import { cpSync } from 'fs'
import devkit from '@nx/devkit'
const { readCachedProjectGraph} = devkit;

const [, , from, to] = process.argv;

const outputRgx = /{options\.(\w+)}/;

const graph = readCachedProjectGraph();
const project = graph.nodes[from];

if(!project) {
    throw new Error('Project not found')
}

const buildOutputs = project.data.targets["build"].outputs;
const buildOptions = project.data.targets["build"].options;
const outputs = []

buildOutputs.forEach(out => {
    if (outputRgx.test(out)) {
        const option = outputRgx.exec(out)[1];
        outputs.push(buildOptions[option]);
        return;
    }

    outputs.push(out);
})

if (outputs.length === 0)
    throw new Error('Project don\'t have outputs')

outputs.forEach(out => {
    cpSync(out, to, { recursive: true })
})