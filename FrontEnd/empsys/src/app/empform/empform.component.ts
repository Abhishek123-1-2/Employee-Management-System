import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmpformService } from './empform.service';
import { EmpForm } from './empform.model';

@Component({
  selector: 'app-empform',
  templateUrl: './empform.component.html',
  styleUrls: ['./empform.component.css'],
})
export class EmpformComponent implements OnInit {
  myForm: FormGroup;
  employeeDataArrayForm: FormArray;
  newlyInsertedEmployees: Array<EmpForm> = [];


  constructor(
    private fb: FormBuilder,
    private empformService: EmpformService,
    private route: ActivatedRoute
  ) {
    this.myForm = this.fb.group({
      employeeData: this.fb.array([]),
    });
    this.loadQueryEmployees();
  }

  ngOnInit() {
    this.employeeDataArrayForm = this.myForm.get('employeeData') as FormArray;
  }

  
  createEmployeeFormGroup() {
    return this.fb.group({
      emp_id: [''],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(5)]],
      contact_no: [
        '',
        [Validators.required, Validators.minLength(10), Validators.pattern(/^\d{10}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required, Validators.minLength(8)]],
      address: [''],
    });
  }

  loadQueryEmployees() {
    this.empformService.getAllEmployees().subscribe(
      (data: any) => {
        if (data && data.status === 'success') {
          this.newlyInsertedEmployees = data.data;
        } else {
          console.error('Invalid data format:', data);
        }
      },
      (error) => {
        console.error('Error loading employees:', error);
      }
    );
  }

  editEmployee(index: number) {
    const employeeFormGroup = this.employeeDataArrayForm.at(index);

    if (employeeFormGroup.valid) {
      const editedEmployee = employeeFormGroup.value;

      this.empformService.addEmployee(editedEmployee).subscribe((response) => {
        if (response && response.status === 'success' && response.data) {
          console.log('Employee inserted successfully');

          
          this.empformService.getEmployeeById(response.data.emp_id).subscribe(
            (newEmployee) => {
              if (newEmployee) {
                
                const newEmployeeFormGroup = this.createEmployeeFormGroup();
                newEmployeeFormGroup.patchValue(newEmployee);

               
                this.employeeDataArrayForm.push(newEmployeeFormGroup);

               
                this.newlyInsertedEmployees.push(newEmployee);
                console.log(this.newlyInsertedEmployees);
              }
            },
            (error) => {
              console.error('Error fetching new employee:', error);
            }
          );

     
          employeeFormGroup.reset();
          employeeFormGroup.disable();
        } else {
          console.error('Failed to insert employee:', response);
        }
      });
    } else {
      employeeFormGroup.enable();
    }
  }

  addEmployee() {
    const employeeFormGroup = this.createEmployeeFormGroup();
    this.employeeDataArrayForm.push(employeeFormGroup);
  }

  deleteEmployee(empId: number) {
    const indexToDelete = this.employeeDataArrayForm.controls.findIndex(
      (control) => control.get('emp_id').value === empId.toString()
    );

    if (indexToDelete !== -1) {
      this.employeeDataArrayForm.removeAt(indexToDelete);
    }

    this.empformService.deleteEmployee(empId).subscribe(
      (response: any) => {
        if (response && response.status === 'success') {
          console.log('Employee deleted successfully');

          const deletedEmployeeIndex = this.newlyInsertedEmployees.findIndex(
            (employee) => employee.emp_id === empId
          );
          if (deletedEmployeeIndex !== -1) {
            this.newlyInsertedEmployees.splice(deletedEmployeeIndex, 1);
          }
        } else {
          console.error('Failed to delete employee:', response);
        }
      },
      (error) => {
        console.error('Error deleting employee:', error);
      }
    );
  }


updateEmployee(index: number) {
  const employeeFormGroup = this.employeeDataArrayForm.at(index);

  if (employeeFormGroup.valid) {
    const updatedEmployee = employeeFormGroup.value;

    this.empformService.updateEmployee(updatedEmployee).subscribe((response) => {
      if (response && response.status === 'success') {
        console.log('Employee updated successfully');

     
        this.newlyInsertedEmployees[index] = updatedEmployee;

        
        employeeFormGroup.reset();
        employeeFormGroup.disable();
      } else {
        console.error('Failed to update employee:', response);
      }
    });
  } else {
    employeeFormGroup.enable();
  }
}


  





  
}
