// Load data from JSON files
async function loadData() {
    try {
        const [profileData, educationData, experienceData, projectsData] = await Promise.all([
            fetch('data/profile.json').then(res => res.json()),
            fetch('data/education.json').then(res => res.json()),
            fetch('data/experience.json').then(res => res.json()),
            fetch('data/projects.json').then(res => res.json())
        ]);
        
        renderProfile(profileData);
        renderEducation(educationData);
        renderExperience(experienceData);
        renderProjects(projectsData);
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render Profile Section
function renderProfile(data) {
    // 1. Amankan data dasar profile agar selalu muncul
    if (data.name) document.getElementById('profile-name').textContent = data.name;
    if (data.description) document.getElementById('profile-description').textContent = data.description;
    if (data.email) document.getElementById('profile-email').textContent = data.email;
    if (data.phone) document.getElementById('profile-phone').textContent = data.phone;
    
    const profilePic = document.getElementById('profile-pic');
    if (profilePic && data.profileImage) {
        // PERHATIAN: Pastikan path folder gambar di profile.json sudah benar (misal: "images/fotoprofile.jpg")
        profilePic.src = data.profileImage;
        profilePic.alt = `${data.name || 'User'}'s profile picture`;
    }
    
    // 2. Render Media Sosial
    const socialLinks = document.getElementById('social-links');
    if (socialLinks && data.socialMedia) {
        socialLinks.innerHTML = '';
        data.socialMedia.forEach(social => {
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="fab fa-${social.platform.toLowerCase()}"></i>`;
            socialLinks.appendChild(link);
        });
    }
    
    // 3. Render Skills (Metode Dua Kolom yang Aman)
    if (data.skills) {
        const hardskillsGrid = document.getElementById('hardskills-grid');
        const softskillsGrid = document.getElementById('softskills-grid');
        
        // Fungsi standarisasi pembuatan struktur item skill agar rapi berjejer ke bawah
        const createSkillItem = (skill) => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item-row'; // Menggunakan class baru agar tidak bentrok dengan CSS lama
            skillItem.innerHTML = `
                <div class="skill-icon"><i class="${skill.icon}"></i></div>
                <div class="skill-info-block">
                    <div class="skill-name">${skill.name}</div>
                    ${skill.level ? `<div class="skill-level"><div class="skill-level-bar" style="width: ${skill.level}%"></div></div>` : ''}
                </div>
            `;
            return skillItem;
        };

        // Render Hard Skills jika elemennya ada di HTML
        if (data.skills.hardskills && hardskillsGrid) {
            hardskillsGrid.innerHTML = '';
            data.skills.hardskills.forEach(skill => {
                hardskillsGrid.appendChild(createSkillItem(skill));
            });
        }

        // Render Soft Skills jika elemennya ada di HTML
        if (data.skills.softskills && softskillsGrid) {
            softskillsGrid.innerHTML = '';
            data.skills.softskills.forEach(skill => {
                softskillsGrid.appendChild(createSkillItem(skill));
            });
        }
    }   
    
    // 4. Render Link Download CV
    if (data.cv) {
        const cvLink = document.getElementById('cv-download');
        if (cvLink) {
            cvLink.href = data.cv.file;
            const cvIcon = cvLink.querySelector('i');
            if (cvIcon) {
                cvIcon.className = data.cv.icon;
            }
            cvLink.setAttribute('download', '');
        }
    }
}

// Render Education Section
function renderEducation(data) {
    const educationList = document.getElementById('education-list');
    
    data.forEach(edu => {
        const eduItem = document.createElement('div');
        eduItem.className = 'education-item';
        eduItem.innerHTML = `
            <div class="edu-header">
                ${edu.logo ? `<img src="${edu.logo}" alt="${edu.university} logo" class="edu-logo">` : ''}
                <div>
                    <h3>${edu.university}</h3>
                    <p class="degree">${edu.major}</p>
                </div>
            </div>
            <p class="year">${edu.year}</p>
            <p>${edu.description}</p>
        `;
        educationList.appendChild(eduItem);
    });
}

// Render Experience Section
function renderExperience(data) {
    const experienceList = document.getElementById('experience-list');
    
    data.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'experience-item';
        expItem.innerHTML = `
            <div class="exp-header">
                ${exp.logo ? `<img src="${exp.logo}" alt="${exp.company} logo" class="exp-logo">` : ''}
                <div>
                    <h3>${exp.company}</h3>
                    <p class="position">${exp.position}</p>
                </div>
            </div>
            <p class="duration">${exp.year}</p>
            <p>${exp.description}</p>
        `;
        experienceList.appendChild(expItem);
    });
}

// GANTI / PASTIKAN FUNGSI RENDER PROJECTS DI SCRIPT.JS MENJADI SEPERTI INI:

function renderProjects(data) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid || !data) return; // Pengaman jika container tidak ketemu
    
    projectsGrid.innerHTML = ''; // Kosongkan container lama

    data.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image || 'images/default-project.png'}" alt="${project.title || 'Project Image'}">
            </div>
            <div class="project-info">
                <h3>${project.title || 'Untitled Project'}</h3>
                <div class="project-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${project.year || ''}</span>
                    ${project.partner ? `<span><i class="fas fa-users"></i> ${project.partner}</span>` : ''}
                    ${project.role ? `<span><i class="fas fa-user-tie"></i> ${project.role}</span>` : ''}
                </div>
                <p>${project.description || ''}</p>
                ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project <i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', loadData);

document.addEventListener('DOMContentLoaded', function() {
    // Highlight active section
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
    });
});