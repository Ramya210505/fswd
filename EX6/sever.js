
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs'); // Uncomment this line to set EJS as the view engine

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://127.0.0.1:27017/leave_management_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('open', () => {
  console.log('Connected to MongoDB');
});

const leaveRequestSchema = new mongoose.Schema({
  employeeName: String,
  leaveType: String,
  startDate: Date,
  endDate: Date,
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

app.get('/', (req, res) => {
  LeaveRequest.find({})
    .exec()
    .then(leaveRequests => {
      res.render('index', { leaveRequests });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/apply', (req, res) => {
  const newLeaveRequest = new LeaveRequest({
    employeeName: req.body.employeeName,
    leaveType: req.body.leaveType,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  newLeaveRequest.save();
  res.end('Submitted');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
