import multer from 'multer';
import path from 'path';
import fs, { stat } from 'fs';
import csv from 'csv-parser';
import { connectToDatabase } from '@/utils/mongodb'; // Adjust the path as necessary
import Election from '@/models/Election'; // Adjust the path as necessary
import Voter from '@/models/Voter'; // Adjust the path as necessary
import Candidate from '@/models/Candidate'; // Adjust the path as necessary
import { Verified } from 'lucide-react';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const readCSVFile = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    bufferStream
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      console.log('Request body:', req.body);
      const { area, date, type, presidedBy, councilSize, maxNominees } = req.body;
      const files = req.files;

      // Check if voters file exists
      if (!files.votersList) {
        return res.status(400).send('Voters file must be uploaded');
      }

      const votersList = files.votersList[0];

      // Check file extension for voters list
      const allowedExtensions = ['.csv', '.xlsx', '.xls'];
      const votersListExtension = path.extname(votersList.originalname);

      if (!allowedExtensions.includes(votersListExtension)) {
        return res.status(400).send('Invalid file format for voters list');
      }

      const votersData = await readCSVFile(votersList.buffer);

      // Delete all the collections of voters and candidates
      await Voter.deleteMany({});
      await Candidate.deleteMany({});
      await Election.deleteMany({});

      const voters = votersData.map(data => ({
        voter_id: data.id, // Assuming id is provided in the CSV
        name: data.name,
        phone: data.phone,
        year_of_membership: parseInt(data.year_of_membership, 10),
        date_of_birth: data.date_of_birth,
        unit: data.unit,
        area: data.area,
        verified: true,
        present: false, // Default value
        voted: false, // Default value
      }));
      console.log(voters);

      await Voter.insertMany(voters);

      let candidateCount = 0;
      let status = "ready";

      

      if (type !== "Electoral Collage") {
        console.log('Creating candidates');
        console.log("Type:", type);

        // Check if candidates file exists
        if (!files.candidatesList) {
          return res.status(400).send('Candidates file must be uploaded');
        }

        const candidatesList = files.candidatesList[0];

        // Check file extension for candidates list
        const candidatesListExtension = path.extname(candidatesList.originalname);

        if (!allowedExtensions.includes(candidatesListExtension)) {
          return res.status(400).send('Invalid file format for candidates list');
        }

        const candidatesData = await readCSVFile(candidatesList.buffer);

        const candidates = candidatesData.map(data => ({
          candidate_id: data.id, // Assuming id is provided in the CSV
          name: data.name,
          phone: data.phone,
          year_of_membership: parseInt(data.year_of_membership, 10),
          date_of_birth: data.date_of_birth,
          unit: data.unit,
          area: data.area,
          votes: 0, // Assuming votes is provided in the CSV
        }));
        status = "ongoing";

        await Candidate.insertMany(candidates);
        candidateCount = await Candidate.countDocuments();
      }

      const voterCount = await Voter.countDocuments();

      const election = new Election({
        area,
        date,
        type,
        presiding_officer: presidedBy,
        perAreaNominees: maxNominees,
        council_size: councilSize,
        status: status,
      });
      await election.save();

      res.status(201).send(`${voterCount} voters and ${candidateCount} candidates added successfully and election created`);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're using multer
  },
};

export default (req, res) => {
  upload.fields([
    { name: 'votersList', maxCount: 1 },
    { name: 'candidatesList', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(501).json({ error: `Sorry something Happened! ${err.message}` });
    }
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    handler(req, res);
  });
};