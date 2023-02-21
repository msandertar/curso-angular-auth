import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';
import { AuthService } from '@services/auth.service';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html',
})
export class RecoveryFormComponent {
  form = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: string = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.queryParams.subscribe({ 
      next: params => {
        const token = params['token'];
        if (token) {
          this.token = token;
        } else {
          this.router.navigate(['/login']);
        }
      }  
    });
  }

  recovery() {
    if (this.form.valid) {
      const { newPassword } = this.form.getRawValue();
      this.status = 'loading';
      this.authService.changePassword(this.token, newPassword)
      .subscribe({ 
        next: () => {
          this.status = 'success';
          this.router.navigate(['/login']);
        }, 
        error: () => { 
          this.status = 'failed';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
