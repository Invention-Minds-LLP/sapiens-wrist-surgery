import { Component, ElementRef, ViewChild  } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-wrist-surgery-page',
  imports: [NgForOf, CommonModule, ReactiveFormsModule,], // Added ReactiveFormsModule
  templateUrl: './wrist-surgery-page.html',
  styleUrl: './wrist-surgery-page.css',
})
export class WristSurgeryPage {

  isMenuOpen = false;

  appointmentForm!: FormGroup;
  userAddress: string = '';
  pageName: string = 'Wrist Surgery';
  isSubmitting: boolean = false;
  submitted: boolean = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private fb: FormBuilder
  ) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  showImage = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.showImage = true;
    }, 5000);

    this.titleService.setTitle(
      'Wrist Surgery in Malleshwaram Bangalore | Dr Darshan Kumar Jain'
    );

    this.metaService.updateTag({
      name: 'description',
      content: 'Expert wrist surgery in Malleshwaram, Bangalore by Dr Darshan Kumar A. Jain, orthopedic hand and wrist specialist for pain, fractures, and carpal tunnel.'
    });

    this.initForm();
    this.fetchUserLocation();
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      patient_name: ['', [Validators.required, Validators.minLength(2)]],
      mobile_number: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]]
    });
  }

  get f() {
    return this.appointmentForm.controls;
  }

  fetchUserLocation(): void {
    if (!navigator.geolocation) {
      console.warn('❌ Geolocation is not supported by your browser.');
      this.userAddress = 'Location unavailable';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log('📍 Coordinates:', latitude, longitude, 'Accuracy (m):', accuracy);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        )
          .then((res) => res.json())
          .then((data) => {
            const addr = data.address || {};
            const area =
              addr.suburb ||
              addr.village ||
              addr.hamlet ||
              addr.neighbourhood ||
              addr.locality ||
              '';
            const city = addr.city || addr.town || addr.municipality || addr.county || '';
            const state = addr.state || '';
            const country = addr.country || '';
            const postal = addr.postcode || '';

            this.userAddress = `${area ? area + ', ' : ''}${city ? city + ', ' : ''}${
              state ? state + ', ' : ''
            }${country}${postal ? ' - ' + postal : ''}`;

            console.log('Precise Address:', this.userAddress);
          })
          .catch((err) => {
            console.error('⚠️ Reverse geocoding failed:', err);
            this.userAddress = `Lat: ${latitude}, Lng: ${longitude}`;
          });
      },
      (err) => {
        console.warn('⚠️ Location error:', err);

        if (err.code === err.PERMISSION_DENIED) {
          console.log('🔁 Fallback: Using IP-based location...');
          this.fetchSecondaryLocation();
        } else {
          switch (err.code) {
            case err.POSITION_UNAVAILABLE:
              console.log('Location unavailable. Trying alternate detection...');
              break;
            case err.TIMEOUT:
              console.log('Location request timed out. Trying alternate detection...');
              break;
            default:
              console.log('Unable to fetch location. Trying alternate detection...');
          }
          this.fetchSecondaryLocation();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }

  fetchSecondaryLocation(): void {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        this.userAddress = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`;
        console.log('IP-based location:', this.userAddress);
      })
      .catch((err) => {
        console.error('Secondary location fetch failed:', err);
        this.userAddress = 'Location unavailable';
      });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.appointmentForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const templateParams = {
      patient_name: this.appointmentForm.value.patient_name,
      mobile_number: this.appointmentForm.value.mobile_number,
      location: this.userAddress || 'Location not available',
      page_name: this.pageName,
      domain_name: 'wristsurgery.in'
    };

    emailjs.send(
      'service_b8jvt4d',
      'template_rhr950l',
      templateParams,
      'TTEfFnQUvu6htAOxZ'
    )
    .then(
      (response) => {
        console.log('✅ Email sent successfully!', response.status, response.text);
        alert('Appointment booked successfully! We will contact you soon.');
        this.appointmentForm.reset();
        this.submitted = false;
      },
      (error) => {
        console.error('❌ Email sending failed:', error);
        alert('Failed to book appointment. Please try again.');
      }
    )
    .finally(() => {
      this.isSubmitting = false;
    });
  }

  symptoms = [
    {
      img: "/wrist-injury-1.png",
      name: "Persistent wrist pain or tenderness",
      alt: 'Wrist injury diagnosis and wrist pain treatment in Malleshwaram Bangalore'
    },
    {
      img: "/wrist-injury-2.png",
      name: "Swelling around the wrist joint",
      alt: 'Assessment of wrist pain by wrist surgeon in Bangalore clinic'
    },
    {
      img: "/wrist-injury-3.png",
      name: "Stiffness or reduced wrist movement",
      alt: 'Non surgical wrist pain treatment by hand and wrist specialist Bangalore'
    },
    {
      img: "/wrist-injury-4.png",
      name: "Weak grip strength or difficulty holding objects",
      alt: 'Severe wrist injury requiring wrist fracture treatment in Bangalore'
    },
    {
      img: "/wrist-injury-5.png",
      name: "Pain during work, typing, sports, or routine hand movement",
      alt: 'Carpal tunnel surgery evaluation by wrist surgeon in Bangalore'
    },
  ]

  treatmentProcedure = [
    {
      image : '/clinical-evaluation.png',
      name: 'Clinical Evaluation',
      description : 'A detailed consultation, physical examination, and imaging tests such as X-rays or MRI help identify the cause of wrist pain or dysfunction.',
      alt : 'Clinical evaluation for wrist pain treatment in Malleshwaram Bangalore'
    },
    {
      image: '/treatment-planning.png',
      name: 'Treatment Planning',
      description: 'Based on the findings, the surgeon explains whether wrist surgery is required and discusses suitable treatment options.',
      alt : 'Personalized wrist surgery treatment planning in Bangalore clinic'
    },
    {
      image: '/treatment-planning.png',
      name: 'Surgical Procedure',
      description: 'Wrist surgery may involve ligament repair, nerve decompression, fracture fixation, or joint correction. Procedures are performed under regional or general anesthesia for patient comfort.',
      alt : ''
    },
    {
      image: '/post-surgery-care.png',
      name: 'Post-Surgery Care',
      description: 'The wrist may be supported with a splint or brace. Pain control and wound care are closely monitored.',
      alt: 'Post surgery care after wrist surgery in Malleshwaram Bangalore'
    },
    {
      image: '/rehabilitation-follow-up.png',
      name: 'Rehabilitation & Follow-Up',
      description: 'Physiotherapy is advised to restore wrist movement, strength, and coordination. Follow-up visits help track recovery progress.',
      alt : 'Rehabilitation follow up after wrist fracture treatment in Bangalore'
    },
  ]

  whychooseus = [
    {
      id: 1,
      name : "Ethical Treatment Approach",
      description : "Wrist treatment decisions guided by clinical need, never pressure."
    },
    {
      id: 2,
      name : "Thorough Evaluation",
      description : "Every wrist condition is carefully assessed before recommending surgery."
    },
    {
      id: 3,
      name : "Expert-Led Care",
      description : "Dr. Darshan Kumar A. Jain ensures clarity and ethical decision-making."
    },
    {
      id: 4,
      name : "Continuity of Care",
      description : "Patients receive guidance from consultation through recovery at our clinic in Malleshwaram, Bangalore, Karnataka."
    },
  ]

  activeIndex: number | null = null;

  faqs = [
    {
      question: 'Is wrist surgery safe?',
      answer: 'Wrist surgery is generally safe when performed after proper evaluation. Risks and benefits are explained during consultation.'
    },
    {
      question: 'Will wrist surgery be painful?',
      answer: 'Pain is usually well managed with medications and post-operative care.'
    },
    {
      question: 'How long does recovery take after wrist surgery?',
      answer: 'Recovery varies. Light activities may resume in weeks, while full recovery may take longer.'
    },
    {
      question: 'Is physiotherapy required after wrist surgery?',
      answer: 'Yes. Physiotherapy helps restore wrist movement, strength, and coordination safely.'
    },
    {
      question: 'When can I return to work?',
      answer: 'Return to work depends on job type and recovery progress.'
    },
    {
      question: 'Is surgery always needed for wrist pain?',
      answer: 'No. Many wrist conditions improve with non-surgical treatment. Wrist surgery is advised only when necessary.'
    }
  ];

  toggle(index: number) {
    console.log('Toggle clicked for index:', index);
    this.activeIndex = this.activeIndex === index ? null : index;
    console.log('New activeIndex:', this.activeIndex);
  }

@ViewChild('appointmentSection', { static: false })
appointmentSection!: ElementRef;

scrollToForm(): void {
  this.appointmentSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

}