import { dirname, join } from "path";
import { promises, createReadStream, createWriteStream } from "fs";
import { pipeline, Transform } from "stream";
import { promisify } from "util";
import StreamConcat from "stream-concat";
import debug from "debug";
import csvtojson from "csvtojson";
import jsontocsv from "json-to-csv-stream";

const pipelineAsync = promisify(pipeline);
const log = debug("app:concat-large-files");
const { readdir } = promises;

const { pathname: currentFile } = new URL(import.meta.url);
const cwd = dirname(currentFile);
const filesDir = `${cwd}/dataset`;
const output = `${cwd}/result/final.csv`;

console.time("app:concat-large-files");

const files = await readdir(filesDir);

log(`processing: ${files} \n`);
const ONE_SECOND = 1000;

// .unref() close the setInterval when others synchronoss process ended
setInterval(() => process.stdout.write("."), ONE_SECOND).unref();
// setTimeout(() => {}, 10000);

// Create a stream for each csv file
const streams = files.map((item) => createReadStream(join(filesDir, item)));
// Join all of the streams in a single variable
const combinedStreams = new StreamConcat(streams);

const finalStream = createWriteStream(output);
const handleStream = new Transform({
  transform: (chunk, encoding, cb) => {
    const data = JSON.parse(chunk);
    const output = {
      id: data.Respondent,
      country: data.Country,
    };

    return cb(null, JSON.stringify(output));
    // Callback role: first the error, second the success, always!
  },
});

await pipelineAsync(
  combinedStreams,
  csvtojson(),
  handleStream,
  jsontocsv(),
  finalStream
);

log(`\n${files.length} files merged! on ${output}`);

console.timeEnd("app:concat-large-files");
