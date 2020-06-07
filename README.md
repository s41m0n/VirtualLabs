# Ai20Lab04

Author: Simone Magnani (s265171)

Subject: Internet Applications - Laboratory n°4

## Compile and run

Install all the dependencies running `npm install`.

You should now be ready to run the application both in development and production mode.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Rung `ng serve --open` to host the server according to the produced files in the `dist/` directory.

## Application state

This behaviour refers to the actual state of the project. There are 10 students in the "database" listed in [this](./src/app/shared/mocks/mock-student.ts) mock file.

There is only one view, the first which appear and it refers to the Internet Application course.

Switching between one course and another is not implemented yet, will be completed in the next lab as also the `Teams` tab.

Student enrolled in the current course are the first 5 of the database for the sake of simplicity.

The sidenav is shown by default.

## Expected behaviour

### Page Refresh

Of course, since I do not have a real database and the students are hard coded into the application, when refreshing the page we should see the initial state, with all the initial enrolled student in the table.

### Autocomplete options

By clicking on the input next to the "Add" button, I expect that all the students in the database are shown as suggestions. These students will be displayed with only their "firstName", while the whole structure is the real data used among these components.

By start typing/removing letters I expect that only the options which includes those letters are displayed, while the others are pruned.

By clicking one of the proposed options I expect that it is inserted in the input, showing only the student name.

### Remove student from the table

By selecting a single checkbox and clicking on the "Delete" button, I should see the row removed from the table and a snackbar appearing showing a result message.

By selecting a multiple checkboxes and clicking on the "Delete" button, I should see the rows removed from the table and a snackbar appearing showing a result message.

By selecting the master checkbox and clicking on the "Delete" button, I should see all the removed from the table and a snackbar appearing showing a result message.

### Add student to the table

All the following actions are performed once an autocomplete option has been selected and I click the "Add" button.

If the user is already in the course/table, I expect that it is not inserted twice and a message showing the result is displayed.

If the user was not in the course/table yet, I expect that it is inserted as a new row and a message showing the result is displayed.

If current field in the input is actually not a student, I expect that nothing alters the system and a message showing the result is displayed.

### Paging

Once the application has started, I expect that the pager shows that there are 5/5 entries, all shown in the first page.

As soon as a student is added, I expect the number of entries changes but the new inserted row would not be shown if the current page contains enough entries.

As soon as a student is deleted, I expect the number of entries changes and if there were entries in other pages, one of them is displayed in the current one.

### Sorting

By clicking on one of the table header referring to the user informations (so not the checkboxes one), I expect the rows will be ordered according to the current method (Ascending/Descending comparing their values with the default methodology).

### Menu icon

By clicking the menu icon, I expect the sidenav to open, showing all the available courses list.

## Screenshots

Available at `screenshots` directory.


/**************************** NEWS TO ADD

json-auth =>  node_modules/json-server-auth/dist/bin.js virtuallabs.json -r virtuallabs_routes.json
app => ng serve OR ng serve --ssl