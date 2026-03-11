@Entity
public class VerificationLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Doctor doctor;
    private String searchedBy; // IP address or "public"
    @Temporal(TemporalType.TIMESTAMP)
    private Date searchTimestamp;
    private boolean resultFound;
    // getters, setters
}