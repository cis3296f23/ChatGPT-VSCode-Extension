import { _logToCSV } from 'activate';



// Select the database to use.
use('ChatGPT');

const dataArray: any[] = [];


function csvToArr(stringVal, splitter) {
  const [keys, ...rest] = stringVal
    .trim()
    .split("\n")
    .map((item) => item.split(splitter));
  const formedArr = rest.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = item.at(index)));
    return object;
  });
  return formedArr;
}


//df.getCollection('ChatGPT').insertMany("chatgpt_logs.csv");

async function insertCSVDataToMongoDB() {
    const csvFilePath = 'chatgpt_logs.csv'; // Replace with the actual path to your CSV file

    // Read CSV file and convert it into an array of objects
    const dataArray: any[] = [];
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            dataArray.push(row);
        })
        .on('end', async () => {


                const collection = db.collection('ChatGPT');

                // Insert the array of objects into the collection
                await collection.insertMany(dataArray);

                console.log('Data inserted into MongoDB collection');
            } catch (err) {
                console.error('Error connecting to MongoDB or inserting data:', err);
            } finally {
                // Close the MongoDB connection
                await client.close();
            }
        });
}

// Call the function to insert CSV data into MongoDB
insertCSVDataToMongoDB();







