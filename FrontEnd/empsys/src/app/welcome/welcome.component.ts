import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  // userData: any;
  // employeeData: any[] = [];
  userData: any;
  username: string;
  dob: string;

  constructor(private http: HttpClient,private userService:UserService,private router:Router) { }
  ngOnInit(): void {
    
    this.username = this.userService.getUsername();
    this.dob = this.userService.getDob();

    
    this.userService.getUserInfo().subscribe(
      (userInfo) => {
        console.log(userInfo);
        this.userData = userInfo;
      },
      (error) => {
        console.error('Error fetching user data: ', error);
       
      }
    );
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
    }
 
  }
 
