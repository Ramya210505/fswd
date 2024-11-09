// Available leave days
let availableAnnualLeave = 10;
let availableSickLeave = 5;
let availableMedicalLeave = 0; // Medical leave is considered unlimited

// Function to update available leave days on the page
function updateLeaveDetails() {
    document.getElementById('annual-leave').textContent = availableAnnualLeave;
    document.getElementById('sick-leave').textContent = availableSickLeave;
    document.getElementById('medical-leave').textContent = availableMedicalLeave;
}

// Function to show the modal with confirmation text
function showConfirmationModal(leaveType, leaveDays, startDate, endDate) {
    const modal = document.getElementById('confirmation-modal');
    const confirmationText = document.getElementById('confirmation-text');
    confirmationText.textContent = `${leaveDays} day(s) of ${leaveType} applied successfully.`;

    // Set the start and end date in the modal
    document.getElementById('modal-start-date').textContent = startDate.toDateString();
    document.getElementById('modal-end-date').textContent = endDate.toDateString();

    modal.style.display = "flex";
}

// Event listener for the leave form submission
document.getElementById('leave-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const leaveType = document.getElementById('leave-type').value;
    const startDate = new Date(document.getElementById('leave-start-date').value);
    const endDate = new Date(document.getElementById('leave-end-date').value);
    const leaveDays = Math.floor((endDate - startDate) / (1000 * 3600 * 24)) + 1;

    // Validation for start and end date
    if (leaveDays <= 0) {
        alert('End date must be later than start date.');
        return;
    }

    // Check if there are enough leave days
    if (leaveType === 'annual' && availableAnnualLeave >= leaveDays) {
        availableAnnualLeave -= leaveDays;
        addLeaveToStatus('Annual Leave', leaveDays, startDate, endDate);
        showConfirmationModal('Annual Leave', leaveDays, startDate, endDate);
    } else if (leaveType === 'sick' && availableSickLeave >= leaveDays) {
        availableSickLeave -= leaveDays;
        addLeaveToStatus('Sick Leave', leaveDays, startDate, endDate);
        showConfirmationModal('Sick Leave', leaveDays, startDate, endDate);
    } else if (leaveType === 'medical') {
        addLeaveToStatus('Medical Leave', leaveDays, startDate, endDate); // Medical leave has no limit
        showConfirmationModal('Medical Leave', leaveDays, startDate, endDate);
    } else {
        alert('Insufficient leave balance.');
        return;
    }

    // Update leave details
    updateLeaveDetails();
});

// Function to add the leave status to the list
function addLeaveToStatus(leaveType, leaveDays, startDate, endDate) {
    const leaveStatusList = document.getElementById('leave-status-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${leaveType}: ${leaveDays} day(s) applied from ${startDate.toDateString()} to ${endDate.toDateString()}.`;
    leaveStatusList.appendChild(listItem);
}

// Close the modal when the user clicks the "X" button
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('confirmation-modal').style.display = "none";
});

// Initialize the leave details on page load
updateLeaveDetails();
