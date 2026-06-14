import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

export const resumeFileName = 'Avinash_Suhagiya_Resume.pdf'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f8fafc',
    color: '#111111',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
    fontSize: 8.5,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#111111',
    color: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    letterSpacing: 1.2,
    fontWeight: 700,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#DEDBC8',
    marginBottom: 6,
  },
  contactRow: {
    fontSize: 8,
    color: '#f8fafc',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E7E0D1',
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#7A6F5B',
    marginBottom: 6,
    fontWeight: 700,
  },
  summary: {
    fontSize: 8.2,
    color: '#222222',
    textAlign: 'justify',
  },
  gridRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flexGrow: 1,
    flexBasis: 0,
  },
  skillLine: {
    fontSize: 8,
    color: '#222222',
    marginBottom: 3.5,
  },
  entry: {
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#111111',
  },
  entryMeta: {
    fontSize: 7.8,
    color: '#6C6457',
    marginBottom: 3,
  },
  bullets: {
    marginTop: 1,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 8,
    color: '#222222',
    marginBottom: 2,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    fontSize: 7.5,
    color: '#6C6457',
    textAlign: 'center',
  },
})

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((item, idx) => (
        <Text key={idx} style={styles.bullet}>
          • {item}
        </Text>
      ))}
    </View>
  )
}

export function ResumePdf() {
  return (
    <Document>
      {/* PAGE 1: Personal info, Summary, Technical Skills, and Projects */}
      <Page size="A4" style={styles.page}>
        {/* Header Banner */}
        <View style={styles.header}>
          <Text style={styles.name}>AVINASH SUHAGIYA</Text>
          <Text style={styles.subtitle}>IT Professional & Full-Stack Developer</Text>
          <Text style={styles.contactRow}>
            Ontario, Canada | +1 (226) 606-8863 | avisuhagiya007@gmail.com | github.com/Kratos-avi | linkedin.com/in/avinashsuhagiya007
          </Text>
        </View>

        <View style={styles.body}>
          {/* Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>
              Detail-oriented IT Support Specialist and recent Mobile and Web Development graduate with a strong background in full-stack web/mobile application architectures, automated cloud infrastructure (AWS/Terraform), 3D animation rendering pipelines, and hardware diagnostics support. Over 2 years of experience configured enterprise network routing, troubleshooting client workstation mainboards, and staging firewalls at Swaminarayan Aksharpith. Highly skilled in Dart (Flutter), JavaScript, C# (Unity), and databases (SQLite/MySQL). Proven capacity to maintain strict security frameworks and troubleshoot software/hardware failures rapidly.
            </Text>
          </View>

          {/* Technical Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.gridRow}>
              <View style={styles.column}>
                <Text style={styles.skillLine}>• Hardware & Networking: Laptop Diagnostics & Repair, Component Replacement, LAN/WAN, Firewalls.</Text>
                <Text style={styles.skillLine}>• Full-Stack Web & Mobile: Flutter (Dart), Node.js & Express, JavaScript, HTML5/CSS3, Kotlin, REST APIs.</Text>
                <Text style={styles.skillLine}>• Database Management: relational MySQL schemas, local SQLite databases, Retrofit API connections.</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.skillLine}>• Cloud Operations: AWS EC2, S3 asset buckets, serverless Lambdas, ALB, Auto Scaling groups, IAM policies.</Text>
                <Text style={styles.skillLine}>• Infrastructure-as-Code: Terraform blueprint setups, version control configuration via Git & GitHub.</Text>
                <Text style={styles.skillLine}>• Game & 3D Dev: C# / Unity, custom enemy AI paths, interactive physics formulas, 3D asset trees staging.</Text>
              </View>
            </View>
          </View>

          {/* Project Experience Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Highlights</Text>
            
            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Digital Life Organizer (Full-Stack Productivity Platform)</Text>
              <BulletList
                items={[
                  'Developed cross-platform mobile app using Dart/Flutter linked to a secure Node.js & Express backend server.',
                  'Designed relational MySQL database schemas to track calendars, tasks, and user profiles.',
                  'Enforced authentication tokens via JSON Web Tokens (JWT) for secure account transactions.',
                ]}
              />
            </View>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Cloud Infrastructure Automation (AWS & Terraform IaC)</Text>
              <BulletList
                items={[
                  'Created Terraform templates to configure redundant, multi-zone virtual networks.',
                  'Configured Application Load Balancer (ALB) systems and Auto-Scaling groups triggered by CPU threshold alarms.',
                  'Implemented secure S3 document directories and strict IAM least-privilege role matrices.',
                ]}
              />
            </View>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Interactive Game Physics & Native Android Development</Text>
              <BulletList
                items={[
                  'Coded modular C# game logic scripts in Unity, designing custom vector physics sandbox behaviors and enemy AI systems.',
                  'Engineered native Android systems in Kotlin using Android Studio, integrating SQLite local database persistence.',
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber}>Page 1 of 2</Text>
      </Page>

      {/* PAGE 2: Complete Work Experience and Education Details */}
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
          {/* Professional Experience Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Warehouse Associate & Floor Diagnostics | Amazon Fulfillment Center</Text>
              <Text style={styles.entryMeta}>Ontario, Canada | 2026 - Present</Text>
              <BulletList
                items={[
                  'Utilize internal logistics systems to manage inventory accuracy, process high-volume orders, and handle workflows.',
                  'Collaborate with floor leads to audit minor scanner software bugs and machinery glitches, reducing processing delays.',
                ]}
              />
            </View>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>IT & Technical Assistant | Swaminarayan Aksharpith</Text>
              <Text style={styles.entryMeta}>Ahmedabad, India | 2021 - 2023</Text>
              <BulletList
                items={[
                  'Diagnosed, repaired, and replaced hardware components on corporate desktops and laptops, minimizing staff downtime.',
                  'Configured, monitored, and maintained campus-wide secure switches, routers, and firewall access control lists.',
                  'Deployed and updated Windows/Linux server operating systems and custom administrative tool suites.',
                  'Provided tier-1 and tier-2 technical diagnostics support, resolving complex network routing issues efficiently.',
                ]}
              />
            </View>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>3D Animation Specialist & Render Admin | Swaminarayan Aksharpith</Text>
              <Text style={styles.entryMeta}>Ahmedabad, India | 2023 - 2024</Text>
              <BulletList
                items={[
                  'Contributed to the asset creation, character layout, and animation pipelines for a major 3D feature project on YouTube.',
                  'Collaborated in multi-disciplinary groups to design user-friendly UI/UX layouts, wireframes, and design components.',
                  'Optimized distributed rendering networks and asset staging files, reducing overall scene export times.',
                ]}
              />
            </View>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Store Associate & POS Systems Staging | Dollarama</Text>
              <Text style={styles.entryMeta}>Ontario, Canada | 2024 - 2025</Text>
              <BulletList
                items={[
                  'Managed point-of-sale (POS) cashier systems, customer billing audits, and inventory tracking databases.',
                  'Assisted store managers in visual merchandising layouts and weekly stock checks, ensuring operational flow.',
                ]}
              />
            </View>

            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Line Cook & Inventory Controller | Choice Indian Restaurant</Text>
              <Text style={styles.entryMeta}>Ontario, Canada | 2024</Text>
              <BulletList
                items={[
                  'Operated kitchen machinery in a fast-paced environment, upholding strict health safety protocols and presentation standards.',
                  'Monitored stock prep timelines, tracking ingredient quantities to limit food waste and ensure speed of service.',
                ]}
              />
            </View>
          </View>

          {/* Education Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.entry}>
              <Text style={styles.entryTitle}>Diploma in Mobile and Web Development</Text>
              <Text style={styles.entryMeta}>Conestoga College | Ontario, Canada | Completed 2026</Text>
              <BulletList
                items={[
                  'Extensive study in Native/Cross-platform mobile apps (Flutter, Kotlin) and full-stack web systems (Node.js, databases).',
                  'Rigorous training in software development lifecycle paradigms, cloud architectures (AWS), and UI/UX styling usability.',
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber}>Page 2 of 2</Text>
      </Page>
    </Document>
  )
}
