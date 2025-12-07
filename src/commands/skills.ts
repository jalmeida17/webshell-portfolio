export const createSkillsHTML = () : string => {
  return `
    <style>
      .skills-container {
        padding: 25px;
        font-family: 'Ubuntu', 'IBM Plex Mono', monospace;
      }
      
      .skills-section {
        margin-bottom: 35px;
      }
      
      .skills-section-title {
        font-size: 20px;
        font-weight: 600;
        color: #E95420;
        margin-bottom: 20px;
        padding-bottom: 8px;
        border-bottom: 2px solid #E95420;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .skills-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 12px;
      }
      
      .skill-badge {
        background: rgba(233, 84, 32, 0.15);
        border: 1.5px solid rgba(233, 84, 32, 0.4);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        color: #FFFFFF;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
      }
      
      .skill-badge i {
        font-size: 16px;
      }
      

      

    </style>
    
    <div class="skills-container">
      <!-- Technical Skills -->
      <div class="skills-section">
        <div class="skills-section-title">
          <i class="fa-solid fa-code"></i>
          Technical Skills
        </div>
        
        <!-- Programming Languages -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #FFFFFF; font-size: 16px; margin-bottom: 8px; font-weight: 600;">
            <i class="fa-solid fa-terminal"></i> Programming Languages
          </h3>
          <div class="skills-badges">
            <span class="skill-badge"><i class="fa-brands fa-js" style="color: #F7DF1E;"></i> JavaScript</span>
            <span class="skill-badge"><i class="fa-brands fa-js" style="color: #3178C6;"></i> TypeScript</span>
            <span class="skill-badge"><i class="fa-solid fa-hashtag" style="color: #9B4F96;"></i> C#</span>
            <span class="skill-badge"><i class="fa-brands fa-python" style="color: #3776AB;"></i> Python</span>
            <span class="skill-badge"><i class="fa-brands fa-html5" style="color: #E34F26;"></i> HTML5</span>
            <span class="skill-badge"><i class="fa-brands fa-css3-alt" style="color: #1572B6;"></i> CSS3</span>
  
          </div>
        </div>
        
        <!-- Frameworks & Libraries -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #FFFFFF; font-size: 16px; margin-bottom: 8px; font-weight: 600;">
            <i class="fa-solid fa-cubes"></i> Frameworks & Libraries
          </h3>
          <div class="skills-badges">
            <span class="skill-badge"><i class="fa-brands fa-react" style="color: #61DAFB;"></i> React.js</span>
            <span class="skill-badge"><i class="fa-brands fa-angular" style="color: #DD0031;"></i> Angular</span>
            <span class="skill-badge"><i class="fa-brands fa-node-js" style="color: #339933;"></i> Node.js</span>
            <span class="skill-badge"><i class="fa-solid fa-code" style="color: #512BD4;"></i> .NET / ASP.NET</span>
            <span class="skill-badge"><i class="fa-solid fa-layer-group" style="color: #FFD166;"></i> PrimeNG</span>
          </div>
        </div>
        
        <!-- Databases -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #FFFFFF; font-size: 16px; margin-bottom: 8px; font-weight: 600;">
            <i class="fa-solid fa-database"></i> Databases
          </h3>
          <div class="skills-badges">
            <span class="skill-badge"><i class="fa-solid fa-database" style="color: #4479A1;"></i> MariaDB</span>
            <span class="skill-badge"><i class="fa-solid fa-leaf" style="color: #47A248;"></i> MongoDB</span>
            <span class="skill-badge"><i class="fa-solid fa-database" style="color: #4479A1;"></i> SQL</span>
          </div>
        </div>
        
        <!-- Cloud & DevOps -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #FFFFFF; font-size: 16px; margin-bottom: 8px; font-weight: 600;">
            <i class="fa-solid fa-cloud"></i> Cloud & DevOps
          </h3>
          <div class="skills-badges">
            <span class="skill-badge"><i class="fa-brands fa-git-alt" style="color: #F05032;"></i> Git</span>
            <span class="skill-badge"><i class="fa-brands fa-github" style="color: #FFFFFF;"></i> GitHub</span>
            <span class="skill-badge"><i class="fa-brands fa-aws" style="color: #FF9900;"></i> AWS</span>
            <span class="skill-badge"><i class="fa-brands fa-microsoft" style="color: #00A4EF;"></i> Azure</span>
            <span class="skill-badge"><i class="fa-solid fa-bolt" style="color: #FFD166;"></i> Power Automate</span>
            <span class="skill-badge"><i class="fa-brands fa-windows" style="color: #00A4EF;"></i> Power BI</span>
            <span class="skill-badge"><i class="fa-solid fa-infinity" style="color: #E95420;"></i> DevOps</span>
          </div>
        </div>
        
        <!-- Other Tools & Technologies -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #FFFFFF; font-size: 16px; margin-bottom: 8px; font-weight: 600;">
            <i class="fa-solid fa-toolbox"></i> Other Tools & Technologies
          </h3>
          <div class="skills-badges">
            <span class="skill-badge"><i class="fa-brands fa-google" style="color: #4285F4;"></i> Google Workspace</span>
            <span class="skill-badge"><i class="fa-solid fa-robot" style="color: #9B59B6;"></i> Generative AI</span>
            <span class="skill-badge"><i class="fa-solid fa-film" style="color: #E74C3C;"></i> Video Editing</span>
            <span class="skill-badge"><i class="fa-brands fa-youtube" style="color: #FF0000;"></i> Content Creation</span>
            <span class="skill-badge"><i class="fa-solid fa-laptop" style="color: #95A5A6;"></i> Hardware</span>
            <span class="skill-badge"><i class="fa-solid fa-microchip" style="color: #34495E;"></i> BIOS</span>
            <span class="skill-badge"><i class="fa-solid fa-palette" style="color: #E91E63;"></i> Canva</span>
          </div>
        </div>
      </div>
      
      <!-- Soft Skills -->
      <div class="skills-section">
        <div class="skills-section-title">
          <i class="fa-solid fa-users"></i>
          Soft Skills
        </div>
        
        <div class="skills-badges">
          <span class="skill-badge" style="background: rgba(74, 246, 38, 0.15); border-color: rgba(74, 246, 38, 0.4);">
            <i class="fa-solid fa-users" style="color: #4AF626;"></i> Team Working
          </span>
          <span class="skill-badge" style="background: rgba(74, 246, 38, 0.15); border-color: rgba(74, 246, 38, 0.4);">
            <i class="fa-solid fa-medal" style="color: #4AF626;"></i> Disciplined
          </span>
          <span class="skill-badge" style="background: rgba(74, 246, 38, 0.15); border-color: rgba(74, 246, 38, 0.4);">
            <i class="fa-solid fa-clock" style="color: #4AF626;"></i> Patient
          </span>
          <span class="skill-badge" style="background: rgba(74, 246, 38, 0.15); border-color: rgba(74, 246, 38, 0.4);">
            <i class="fa-solid fa-smile" style="color: #4AF626;"></i> Easygoing
          </span>
        </div>
      </div>
      
      <!-- Languages -->
      <div class="skills-section">
        <div class="skills-section-title">
          <i class="fa-solid fa-globe"></i>
          Languages
        </div>
        
        <div class="skills-badges">
          <span class="skill-badge" style="background: rgba(41, 143, 221, 0.15); border-color: rgba(41, 143, 221, 0.4);">
            🇬🇧 English <span style="color: #4AF626; margin-left: 5px; font-weight: 700;">95%</span>
          </span>
          <span class="skill-badge" style="background: rgba(41, 143, 221, 0.15); border-color: rgba(41, 143, 221, 0.4);">
            🇫🇷 French <span style="color: #4AF626; margin-left: 5px; font-weight: 700;">90%</span>
          </span>
          <span class="skill-badge" style="background: rgba(41, 143, 221, 0.15); border-color: rgba(41, 143, 221, 0.4);">
            🇵🇹 Portuguese <span style="color: #4AF626; margin-left: 5px; font-weight: 700;">85%</span>
          </span>
          <span class="skill-badge" style="background: rgba(41, 143, 221, 0.15); border-color: rgba(41, 143, 221, 0.4);">
            🇪🇸 Spanish <span style="color: #4AF626; margin-left: 5px; font-weight: 700;">70%</span>
          </span>
        </div>
      </div>
    </div>
  `;
}

export const SKILLS = createSkillsHTML();
