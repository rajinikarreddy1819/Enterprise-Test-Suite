@Entity
public class Doctor {
    @Id
    private Long id; // same as User.id (shared primary key)
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    @Column(unique = true, nullable = false)
    private String licenseNumber;
    private String specialization;
    private String qualifications; // e.g., "MBBS, MD"
    private String contactEmail;
    private String contactPhone;
    private String clinicAddress;
    @Temporal(TemporalType.DATE)
    private Date licenseExpiryDate;
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus; // VERIFIED, EXPIRED, REVOKED, PENDING
    private String qrCodePath; // store path or base64 image
    // getters, setters
}
public enum VerificationStatus { VERIFIED, EXPIRED, REVOKED, PENDING }